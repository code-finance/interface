import {
  Asset,
  Factory,
  JettonRoot,
  MAINNET_FACTORY_ADDR,
  PoolType,
  ReadinessStatus,
  VaultJetton,
} from '@dedust/sdk';
import { Address, beginCell, Cell, Sender, toNano } from '@ton/core';
import { TonClient4 } from '@ton/ton';

import {
  BorrowParams,
  InitReserveParams,
  JettonMinter,
  JettonWallet,
  Pool,
  RateStrategy,
  RepayCollateralParams,
  ReserveConfig,
  User,
  WithdrawParams,
} from '../wrappers';
import { InterestRateMode, TON_METADATA } from './constants';
import { DeployedContract, IRateStrategy, IReserveConfig, Jettons, Provider } from './types';
import { getPriceData, openContract } from './utils';
import { buildJettonOnChainMetadata, readJettonMetadata } from './utils/metadata';

export class App {
  provider: Provider;
  pool: DeployedContract<Pool>;
  minter: (_minter: Address) => DeployedContract<JettonMinter>;
  wallet: (_wallet: Address) => DeployedContract<JettonWallet>;
  user: (_user: Address) => DeployedContract<User>;

  constructor(provider: Provider, address: Address) {
    this.provider = provider;
    this.pool = openContract<Pool>(provider, Pool.createFromAddress(address));
    this.minter = (_minter: Address) =>
      openContract<JettonMinter>(provider, JettonMinter.createFromAddress(_minter));
    this.wallet = (_wallet: Address) =>
      openContract<JettonWallet>(provider, JettonWallet.createFromAddress(_wallet));
    this.user = (_user: Address) => openContract<User>(provider, User.createFromAddress(_user));
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
      console.log('here');
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

  async sendRepay(
    via: Sender,
    underlyingAddress: Address,
    amount: bigint,
    {
      interestRateMode,
      isMaxRepay,
      useAToken,
    }: { interestRateMode: InterestRateMode; isMaxRepay: boolean; useAToken: boolean },
    underlyingAddressCollateral?: Address, //For repay collateral -> Required
    jettons?: Jettons //For repay collateral -> Required
  ) {
    if (!via.address) throw new Error('Sender address is required');

    if (!underlyingAddressCollateral) {
      console.log('repay wallet balance');
      if (underlyingAddress.equals(this.pool.address)) {
        const poolJWAddress = this.pool.address;
        return this.pool.sendRepay(via, {
          poolJWAddress,
          amount,
          interestRateMode,
          isMaxRepay,
          useAToken,
        });
      }

      const minter = this.minter(underlyingAddress);
      const wallet = this.wallet(await minter.getWalletAddress(via.address));

      // TODO: Move the following constants to external files
      const REPAY_MESSAGE_VALUE = toNano(0.2);
      const REPAY_MESSAGE_OP = 0x95cded06;
      const FORWARD_TON_AMOUNT = toNano(0.1);
      const FORWARD_PAYLOAD = beginCell()
        .storeUint(REPAY_MESSAGE_OP, 32)
        .storeBit(interestRateMode)
        .storeBit(useAToken)
        .storeBit(isMaxRepay)
        .endCell();

      return wallet.sendTransfer(
        via,
        REPAY_MESSAGE_VALUE,
        amount,
        this.pool.address,
        via.address,
        Cell.EMPTY,
        FORWARD_TON_AMOUNT,
        FORWARD_PAYLOAD
      );
    } else {
      console.log('repay by collateral');
      let poolJWAddress: Address;
      if (underlyingAddress.equals(this.pool.address)) {
        poolJWAddress = this.pool.address;
      } else {
        const minter = this.minter(underlyingAddress);
        poolJWAddress = await minter.getWalletAddress(this.pool.address);
      }

      let poolJWCollateral: Address;
      if (underlyingAddressCollateral.equals(this.pool.address)) {
        poolJWCollateral = this.pool.address;
      } else {
        const minter = this.minter(underlyingAddressCollateral);
        poolJWCollateral = await minter.getWalletAddress(this.pool.address);
      }

      const tonClient = new TonClient4({
        endpoint: process.env.API_ENDPOINT_TESTNET ?? 'https://sandbox-v4.tonhubapi.com',
      });
      const factory = tonClient.open(
        Factory.createFromAddress(
          Address.parse(
            process.env.FACTORY_DEDUST_TESTNET ?? 'EQAROb_l-1yGMKjPGUmc0tNjYOsXTKTsucXmhh2Fm9y98z7Y'
          )
        )
      );

      let assetRepay = Asset.jetton(underlyingAddress);
      let assetCollateral = Asset.jetton(underlyingAddressCollateral);

      if (underlyingAddress.equals(this.pool.address)) {
        console.log('check 1');
        assetRepay = Asset.native();
      } else {
        console.log('check 2');
        assetRepay = Asset.jetton(underlyingAddress);
      }
      if (underlyingAddressCollateral.equals(this.pool.address)) {
        console.log('check 3');
        assetCollateral = Asset.native();
      } else {
        console.log('check 4');
        assetCollateral = Asset.jetton(underlyingAddressCollateral);
      }

      const poolSwap = tonClient.open(
        await factory.getPool(PoolType.VOLATILE, [assetCollateral, assetRepay])
      );
      console.log('await poolSwap.getReadinessStatus()', await poolSwap.getReadinessStatus());

      if ((await poolSwap.getReadinessStatus()) == ReadinessStatus.READY) {
        console.log('dedust pool ready');

        const priceData = await getPriceData(this.provider, jettons);

        let vaultAddress = (await factory.getJettonVault(underlyingAddressCollateral)).address;
        if (underlyingAddressCollateral.equals(this.pool.address)) {
          vaultAddress = tonClient.open(await factory.getNativeVault()).address;
        }
        const swapPoolAddress = poolSwap.address;

        const repayParams: RepayCollateralParams = {
          poolJWAddress,
          poolJWCollateral,
          amountCollateral: amount,
          interestRateMode,
          isMax: isMaxRepay,
          priceData,
          vaultAddress,
          swapPoolAddress,
        };

        return this.pool.sendRepayCollateral(via, repayParams);
      }
    }
  }

  async sendSetUseReserveAsCollateral(
    via: Sender,
    underlyingAddress: Address,
    useAsCollateral: boolean,
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

    return this.pool.sendSetUseReserveAsCollateral(via, {
      useAsCollateral,
      poolJWAddress,
      priceData,
    });
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

  async getUserData(ownerAddress: Address) {
    const userAddress = await this.pool.getUserAddress(ownerAddress);
    return this.user(userAddress).getUserData();
  }

  async getUserAddress(ownerAddress: Address) {
    return this.pool.getUserAddress(ownerAddress);
  }

  async getJettonBalance(ownerAddress: Address, underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    const wallet = this.wallet(await minter.getWalletAddress(ownerAddress));
    return wallet.getJettonBalance();
  }

  async getJettonWallet(ownerAddress: Address, underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    return minter.getWalletAddress(ownerAddress);
  }
}
