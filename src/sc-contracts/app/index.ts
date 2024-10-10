import { Address, beginCell, Cell, Sender, toNano } from '@ton/core';

import {
  BorrowParams,
  InitReserveParams,
  JettonMinter,
  JettonWallet,
  Pool,
  RateStrategy,
  ReserveConfig,
  WithdrawParams,
} from '../wrappers';
import { InterestRateMode } from './constants';
import { DeployedContract, IRateStrategy, IReserveConfig, Jettons, Provider } from './types';
import { getPriceData, openContract } from './utils';
import { buildJettonOnChainMetadata, readJettonMetadata } from './utils/metadata';

const TON_METADATA = {
  name: 'TON',
  symbol: 'TON',
  decimals: '9',
  image: 'https://cryptologos.cc/logos/toncoin-ton-logo.png?v=032',
  description: 'TON',
};

export class App {
  provider: Provider;
  pool: DeployedContract<Pool>;
  minter: (_minter: Address) => DeployedContract<JettonMinter>;
  wallet: (_wallet: Address) => DeployedContract<JettonWallet>;

  constructor(provider: Provider, address: Address) {
    this.provider = provider;
    this.pool = openContract<Pool>(provider, Pool.createFromAddress(address));
    this.minter = (address: Address) =>
      openContract<JettonMinter>(provider, JettonMinter.createFromAddress(address));
    this.wallet = (_wallet: Address) =>
      openContract<JettonWallet>(provider, JettonWallet.createFromAddress(_wallet));
  }

  async sendInitReserve(
    via: Sender,
    underlyingAddress: Address,
    reserveConfig: IReserveConfig,
    rateStrategy: IRateStrategy
  ) {
    let content: Cell;
    let decimals: number;
    let poolJWAddress: Address;

    if (underlyingAddress.equals(this.pool.address)) {
      content = buildJettonOnChainMetadata(TON_METADATA);
      decimals = Number(TON_METADATA.decimals);
      poolJWAddress = this.pool.address;
    } else {
      const minter = this.minter(underlyingAddress);
      const jettonData = await minter.getJettonData();
      content = jettonData.content;
      const { metadata } = await readJettonMetadata(content);
      decimals = Number(metadata.decimals);
      poolJWAddress = await minter.getWalletAddress(this.pool.address);
    }

    const _reserveConfig: ReserveConfig = {
      underlyingAddress,
      poolJWAddress,
      decimals,
      content,
      ...reserveConfig,
    };

    const _rateStrategy: RateStrategy = {
      ...rateStrategy,
    };

    const params: InitReserveParams = {
      poolJWAddress,
      reserveConfig: _reserveConfig,
      rateStrategy: _rateStrategy,
    };

    return this.pool.sendInitReserve(via, params);
  }

  async sendSupply(via: Sender, underlyingAddress: Address, amount: bigint) {
    if (!via.address) throw new Error('Sender address is required');

    if (underlyingAddress.equals(this.pool.address)) {
      return this.pool.sendSupply(via, { amount, poolJWAddress: this.pool.address });
    }

    const minter = this.minter(underlyingAddress);
    const wallet = this.wallet(await minter.getWalletAddress(via.address));

    // TODO: Move the following constants to external files
    const SUPPLY_MESSAGE_VALUE = toNano(0.1);
    const SUPPLY_MESSAGE_OP = 0x1530f236;
    const FORWARD_TON_AMOUNT = toNano(0.05);
    const FORWARD_PAYLOAD = beginCell().storeUint(SUPPLY_MESSAGE_OP, 32).endCell();

    return wallet.sendTransfer(
      via,
      SUPPLY_MESSAGE_VALUE,
      amount,
      this.pool.address,
      via.address,
      Cell.EMPTY,
      FORWARD_TON_AMOUNT,
      FORWARD_PAYLOAD
    );
  }

  async sendBorrow(
    via: Sender,
    underlyingAddress: Address,
    amount: bigint,
    interestRateMode: InterestRateMode,
    jettons?: Jettons
  ) {
    let poolJWAddress: Address;
    if (underlyingAddress.equals(this.pool.address)) {
      poolJWAddress = this.pool.address;
    } else {
      const minter = this.minter(underlyingAddress);
      poolJWAddress = await minter.getWalletAddress(this.pool.address);
    }

    const priceData = await getPriceData(this.provider, jettons);

    const borrowParams: BorrowParams = {
      poolJWAddress,
      amount,
      interestRateMode,
      priceData,
    };

    return this.pool.sendBorrow(via, borrowParams);
  }

  async sendWithdraw(
    via: Sender,
    underlyingAddress: Address,
    {
      amount,
      isMaxWithdraw,
      jettons,
    }: { amount?: bigint; isMaxWithdraw?: boolean; jettons?: Jettons }
  ) {
    let poolJWAddress: Address;
    if (underlyingAddress.equals(this.pool.address)) {
      poolJWAddress = this.pool.address;
    } else {
      const minter = this.minter(underlyingAddress);
      poolJWAddress = await minter.getWalletAddress(this.pool.address);
    }

    const priceData = await getPriceData(this.provider, jettons);

    const withdrawParams: WithdrawParams = {
      poolJWAddress,
      amount,
      isMaxWithdraw,
      priceData,
    };

    return this.pool.sendWithdraw(via, withdrawParams);
  }

  async getReserveData(underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    const poolJWAddress = await minter.getWalletAddress(this.pool.address);
    return this.pool.getReserveData(poolJWAddress);
  }

  async getReserveList() {
    return this.pool.getReserveList();
  }

  async getReservesData() {
    return this.pool.getReservesData();
  }
}
