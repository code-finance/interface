import {
  Asset,
  Factory,
  MAINNET_FACTORY_ADDR,
  Pool as PoolDD,
  PoolType,
  ReadinessStatus,
} from '@dedust/sdk';
import { Address, beginCell, Cell, Sender, toNano } from '@ton/core';
import {
  BorrowParams,
  CustomFactory,
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
import { getMockPriceData, getPriceData, openContract } from './utils';
import { buildJettonOnChainMetadata, readJettonMetadata } from './utils/metadata';

type ISwapParams = {
  underlyingAddress: Address;
  collateralAddress?: Address;
  swapPoolAddress: Address;
  collateralVaultAddress: Address;
  interestRateMode: InterestRateMode;
  amount?: bigint;
  isMaxRepay?: boolean;
  jettons?: Jettons;
  tonPrice?: string;
};

export class App {
  provider: Provider;
  pool: DeployedContract<Pool>;
  factory: DeployedContract<Factory>;
  minter: (_minter: Address) => DeployedContract<JettonMinter>;
  wallet: (_wallet: Address) => DeployedContract<JettonWallet>;
  user: (_user: Address) => DeployedContract<User>;

  constructor(provider: Provider, address: Address, addressFactory?: Address) {
    this.provider = provider;
    this.pool = openContract<Pool>(provider, Pool.createFromAddress(address));

    addressFactory = addressFactory ?? MAINNET_FACTORY_ADDR;
    this.factory = openContract<Factory>(provider, CustomFactory.createFromAddress(addressFactory));

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
      return this.pool.sendSupply(via, { amount, poolJWAddress: this.pool.address });
    }

    const minter = this.minter(underlyingAddress);
    const wallet = this.wallet(await minter.getWalletAddress(via.address));

    // TODO: Move the following constants to external files
    const SUPPLY_MESSAGE_VALUE = toNano(0.25);
    const SUPPLY_MESSAGE_OP = 0x1530f236;
    const FORWARD_TON_AMOUNT = toNano(0.15);
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

    const priceData = jettons ? await getMockPriceData() : await getPriceData();

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
    }: { amount?: bigint; isMaxWithdraw?: boolean; jettons?: Jettons; tonPrice?: string }
  ) {
    let poolJWAddress: Address;
    if (underlyingAddress.equals(this.pool.address)) {
      poolJWAddress = this.pool.address;
    } else {
      const minter = this.minter(underlyingAddress);
      poolJWAddress = await minter.getWalletAddress(this.pool.address);
    }

    const priceData = await getPriceData();

    const withdrawParams: WithdrawParams = {
      poolJWAddress,
      amount,
      isMaxWithdraw,
      priceData,
    };

    return this.pool.sendWithdraw(via, withdrawParams);
  }

  async estimateAmountInSwap(
    amountOut: bigint,
    underlyingAddressIn: Address,
    underlyingAddressOut: Address
  ) {
    let assetIn = Asset.jetton(underlyingAddressIn);
    let assetOut = Asset.jetton(underlyingAddressOut);

    if (underlyingAddressIn.equals(this.pool.address)) {
      // console.log('check 1');
      assetIn = Asset.native();
    } else {
      // console.log('check 2');
      assetIn = Asset.jetton(underlyingAddressIn);
    }
    if (underlyingAddressOut.equals(this.pool.address)) {
      // console.log('check 3');
      assetOut = Asset.native();
    } else {
      // console.log('check 4');
      assetOut = Asset.jetton(underlyingAddressOut);
    }

    const poolSwap = openContract<PoolDD>(
      this.provider,
      await this.factory.getPool(PoolType.VOLATILE, [assetIn, assetOut])
    );

    let amountInTemp = (
      await poolSwap.getEstimatedSwapOut({ assetIn: assetOut, amountIn: amountOut })
    ).amountOut;

    const incrementFactor = BigInt(110); // Factor to increase by 10%
    const divisor = BigInt(100); // Divisor for percentage calculation
    let amountOutTemp = BigInt(0);

    // Loop until amountOutTemp is greater than amountOut
    while (amountOutTemp <= amountOut) {
      // console.log('Current amountInTemp = ', amountInTemp);

      // Increase amountInTemp by 10%
      amountInTemp = (amountInTemp * incrementFactor) / divisor;

      // Get the new amountOutTemp based on updated amountInTemp
      amountOutTemp = (
        await poolSwap.getEstimatedSwapOut({ assetIn: assetIn, amountIn: amountInTemp })
      ).amountOut;

      // console.log('Updated amountInTemp (after 10% increase) = ', amountInTemp);
      // console.log('Updated amountOutTemp = ', amountOutTemp);
    }

    // Return the final amountInTemp that caused amountOutTemp to exceed amountOut
    return amountInTemp;
  }

  async sendRepay(
    via: Sender,
    underlyingAddress: Address,
    amount: bigint,
    {
      interestRateMode,
      isMaxRepay,
      useAToken,
      amountCollateral,
      underlyingAddressCollateral,
      jettons,
    }: {
      interestRateMode: InterestRateMode;
      isMaxRepay: boolean;
      useAToken: boolean;
      amountCollateral?: bigint;
      underlyingAddressCollateral?: Address;
      jettons?: Jettons;
    }
  ) {
    if (!via.address) throw new Error('Sender address is required');

    // console.log('underlyingAddressCollateral', underlyingAddressCollateral);
    if (underlyingAddressCollateral === undefined) {
      // console.log('repay wallet balance');
      if (underlyingAddress.equals(this.pool.address)) {
        // console.log('repay wallet balance 2');
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
      const REPAY_MESSAGE_VALUE = toNano(0.25);
      const REPAY_MESSAGE_OP = 0x95cded06;
      const FORWARD_TON_AMOUNT = toNano(0.2);
      const FORWARD_PAYLOAD = beginCell()
        .storeUint(REPAY_MESSAGE_OP, 32)
        .storeBit(interestRateMode)
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
      // console.log('repay by collateral');
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

      let assetRepay = Asset.jetton(underlyingAddress);
      let assetCollateral = Asset.jetton(underlyingAddressCollateral);

      if (underlyingAddress.equals(this.pool.address)) {
        // console.log('check 1');
        assetRepay = Asset.native();
      } else {
        // console.log('check 2');
        assetRepay = Asset.jetton(underlyingAddress);
      }
      if (underlyingAddressCollateral.equals(this.pool.address)) {
        // console.log('check 3');
        assetCollateral = Asset.native();
      } else {
        // console.log('check 4');
        assetCollateral = Asset.jetton(underlyingAddressCollateral);
      }

      const poolSwap = openContract<PoolDD>(
        this.provider,
        await this.factory.getPool(PoolType.VOLATILE, [assetRepay, assetCollateral])
      );

      if ((await poolSwap.getReadinessStatus()) == ReadinessStatus.READY) {
        // console.log('dedust pool ready');

        const priceData = jettons ? await getMockPriceData() : await getPriceData();

        let vaultAddress = (await this.factory.getJettonVault(underlyingAddressCollateral)).address;
        if (underlyingAddressCollateral.equals(this.pool.address)) {
          vaultAddress = (await this.factory.getNativeVault()).address;
        }
        const swapPoolAddress = poolSwap.address;

        const repayParams: RepayCollateralParams = {
          poolJWAddress,
          poolJWCollateral,
          amountRepay: amount,
          amountCollateral: amountCollateral ?? BigInt(0),
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

    const priceData = jettons ? await getMockPriceData() : await getPriceData();

    return this.pool.sendSetUseReserveAsCollateral(via, {
      useAsCollateral,
      poolJWAddress,
      priceData,
    });
  }

  async sendSwap(via: Sender, params: ISwapParams) {
    const {
      underlyingAddress,
      swapPoolAddress,
      collateralVaultAddress,
      interestRateMode,
      isMaxRepay,
      amount,
      jettons,
    } = params;

    return this.pool.sendSwap(via, {
      poolJWAddress: await this.minter(underlyingAddress).getWalletAddress(this.pool.address),
      amount,
      interestRateMode,
      isMaxRepay,
      swapPoolAddress,
      collateralVaultAddress,
      priceData: jettons ? await getMockPriceData() : await getPriceData(),
    });
  }

  async sendSwapRateMode(
    via: Sender,
    underlyingAddress: Address,
    interestRateMode: InterestRateMode
  ) {
    let poolJWAddress: Address;
    if (underlyingAddress.equals(this.pool.address)) {
      poolJWAddress = this.pool.address;
    } else {
      const minter = this.minter(underlyingAddress);
      poolJWAddress = await minter.getWalletAddress(this.pool.address);
    }
    return this.pool.sendSwapRateMode(via, {
      poolJWAddress: poolJWAddress,
      interestRateMode,
    });
  }

  async getReserveData(underlyingAddress: Address) {
    if (underlyingAddress.equals(this.pool.address)) {
      return this.pool.getReserveData(this.pool.address);
    }

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
    // console.log('userAddress', userAddress);
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

  async getNormalizedIncome(underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    const poolJWAddress = await minter.getWalletAddress(this.pool.address);
    return this.pool.getNormalizedIncome(poolJWAddress);
  }

  async getNormalizedDebt(underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    const poolJWAddress = await minter.getWalletAddress(this.pool.address);
    return this.pool.getNormalizedDebt(poolJWAddress);
  }

  async getPoolBalance() {
    return this.pool.getPoolBalance();
  }

  async getPoolJettonBalance(underlyingAddress: Address) {
    const minter = this.minter(underlyingAddress);
    const wallet = this.wallet(await minter.getWalletAddress(this.pool.address));
    return wallet.getJettonBalance();
  }

  async getAdmin() {
    return this.pool.getAdmin();
  }
}
