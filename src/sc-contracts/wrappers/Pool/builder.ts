import { beginCell, Cell, Dictionary } from '@ton/core';

import { Op } from '../common/constants';
import {
  BorrowParams,
  InitReserveParams,
  PoolConfig,
  RateStrategy,
  RepayCollateralParams,
  RepayParams,
  ReserveConfig,
  SetUseReserveAsCollateralParams,
  SupplyParams,
  SwapParams,
  WithdrawParams,
} from './types';

export function PoolConfigToCell(config: PoolConfig): Cell {
  const newDict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
  return beginCell()
    .storeAddress(config.admin)
    .storeDict(newDict)
    .storeDict(newDict)
    .storeDict(newDict)
    .storeBuffer(config.bePublicKey)
    .storeUint(config.maxStableRateBorrowSizePercent, 16)
    .storeRef(config.userCode)
    .endCell();
}

export function ReserveConfigToCell(config: ReserveConfig): Cell {
  return beginCell()
    .storeRef(
      beginCell()
        .storeAddress(config.underlyingAddress)
        .storeAddress(config.poolJWAddress)
        .endCell()
    )
    .storeUint(config.LTV, 16)
    .storeUint(config.liquidationThreshold, 16)
    .storeUint(config.decimals, 8)
    .storeBit(config.isActive)
    .storeBit(config.isFrozen)
    .storeBit(config.isBorrowingEnabled)
    .storeBit(config.stableRateBorrowingEnabled)
    .storeBit(config.isPaused)
    .storeBit(config.isJetton)
    .storeUint(config.reserveFactor, 32)
    .storeCoins(config.supplyCap)
    .storeCoins(config.borrowCap)
    .storeCoins(config.debtCeiling)
    .storeRef(config.content)
    .endCell();
}

export function RateStrategyToCell(config: RateStrategy): Cell {
  return beginCell()
    .storeUint(config.baseVariableBorrowRate, 128)
    .storeRef(
      beginCell()
        .storeUint(config.optimalUsageRatio, 128)
        .storeUint(config.optimalStableToTotalDebtRatio, 128)
        .endCell()
    )
    .storeRef(
      beginCell()
        .storeUint(config.variableRateSlope1, 128)
        .storeUint(config.variableRateSlope2, 128)
        .storeUint(config.stableRateSlope1, 128)
        .storeUint(config.stableRateSlope2, 128)
        .endCell()
    )
    .storeRef(
      beginCell()
        .storeUint(config.baseStableRateOffset, 128)
        .storeUint(config.stableRateExcessOffset, 128)
        .endCell()
    )
    .endCell();
}

export function InitReserveParamsToCell(config: InitReserveParams): Cell {
  const { poolJWAddress, reserveConfig, rateStrategy } = config;
  return beginCell()
    .storeUint(Op.INIT_RESERVE, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeRef(ReserveConfigToCell(reserveConfig))
    .storeRef(RateStrategyToCell(rateStrategy))
    .endCell();
}

export function BorrowParamsToCell(config: BorrowParams): Cell {
  const { poolJWAddress, amount, interestRateMode, priceData } = config;

  return beginCell()
    .storeUint(Op.BORROW, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeCoins(amount)
    .storeUint(interestRateMode, 1)
    .storeAddress(poolJWAddress)
    .storeDict(priceData)
    .endCell();
}

export function WithdrawParamsToCell(config: WithdrawParams): Cell {
  const { poolJWAddress, amount, isMaxWithdraw, priceData } = config;
  console.log('sending', poolJWAddress);

  return beginCell()
    .storeUint(Op.WITHDRAW, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeCoins(amount ?? 0)
    .storeBit(isMaxWithdraw ?? false)
    .storeDict(priceData)
    .endCell();
}

export function SupplyParamsToCell(config: SupplyParams): Cell {
  const { amount, poolJWAddress } = config;

  return beginCell()
    .storeUint(Op.SUPPLY, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeCoins(amount)
    .endCell();
}

export function SetUseReserveAsCollateralParamsToCell(config: SetUseReserveAsCollateralParams) {
  const { poolJWAddress, useAsCollateral, priceData } = config;

  return beginCell()
    .storeUint(Op.SET_USE_RESERVE_AS_COLLATERAL, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeBit(useAsCollateral)
    .storeDict(priceData)
    .endCell();
}

export function RepayCollateralParamsToCell(params: RepayCollateralParams): Cell {
  const {
    poolJWAddress,
    poolJWCollateral,
    amountRepay,
    amountCollateral,
    interestRateMode,
    isMax,
    priceData,
    vaultAddress,
    swapPoolAddress,
  } = params;

  const dedustInfo = beginCell().storeAddress(vaultAddress).storeAddress(swapPoolAddress).endCell();
  return beginCell()
    .storeUint(Op.REPAY_COLLATERAL, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeCoins(amountRepay)
    .storeCoins(amountCollateral)
    .storeUint(interestRateMode, 1)
    .storeAddress(poolJWAddress)
    .storeAddress(poolJWCollateral)
    .storeBit(isMax)
    .storeDict(priceData)
    .storeRef(dedustInfo)
    .endCell();
}

export function RepayParamsToCell(params: RepayParams): Cell {
  const { poolJWAddress, amount, interestRateMode, isMaxRepay, useAToken } = params;

  return beginCell()
    .storeUint(Op.REPAY, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeCoins(amount)
    .storeUint(interestRateMode, 1)
    .storeBit(isMaxRepay)
    .endCell();
}

export function SwapParamsToCell(params: SwapParams): Cell {
  const {
    poolJWAddress,
    amount,
    interestRateMode,
    isMaxRepay,
    swapPoolAddress,
    collateralVaultAddress,
    priceData,
  } = params;
  return beginCell()
    .storeUint(Op.SWAP, 32)
    .storeUint(Math.floor(Date.now() / 1000), 64)
    .storeAddress(poolJWAddress)
    .storeCoins(amount ?? 0)
    .storeUint(interestRateMode, 1)
    .storeBit(isMaxRepay ?? false)
    .storeDict(priceData)
    .storeRef(
      beginCell().storeAddress(swapPoolAddress).storeAddress(collateralVaultAddress).endCell()
    )
    .endCell();
}
