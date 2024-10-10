import { Cell } from '@ton/core';

import { RateStrategy, ReserveConfig, ReserveState } from './types';

export function parseReserveConfig(cell: Cell): ReserveConfig {
  const cs = cell.beginParse();
  const addresses = cs.loadRef().beginParse();
  const underlyingAddress = addresses.loadAddress();
  const poolJWAddress = addresses.loadAddress();
  const LTV = cs.loadUint(16);
  const liquidationThreshold = cs.loadUint(16);
  const decimals = cs.loadUint(8);
  const isActive = cs.loadBoolean();
  const isFrozen = cs.loadBoolean();
  const isBorrowingEnabled = cs.loadBoolean();
  const stableRateBorrowingEnabled = cs.loadBoolean();
  const isPaused = cs.loadBoolean();
  const isJetton = cs.loadBoolean();
  const reserveFactor = cs.loadUint(32);
  const supplyCap = cs.loadCoins();
  const borrowCap = cs.loadCoins();
  const debtCeiling = cs.loadCoins();
  const content = cs.loadRef();

  return {
    underlyingAddress,
    poolJWAddress,
    decimals,
    LTV,
    liquidationThreshold,
    isActive,
    isFrozen,
    isBorrowingEnabled,
    stableRateBorrowingEnabled,
    isPaused,
    isJetton,
    reserveFactor,
    supplyCap,
    borrowCap,
    debtCeiling,
    content,
  };
}

export function parseReserveState(cell: Cell): ReserveState {
  const cs = cell.beginParse();
  const supplyData = cs.loadRef().beginParse();
  const totalSupply = supplyData.loadCoins();
  const liquidity = supplyData.loadCoins();
  const liquidityIndex = supplyData.loadUintBig(128);
  const currentLiquidityRate = supplyData.loadUintBig(128);

  const variableBorrowData = cs.loadRef().beginParse();
  const totalVariableDebt = variableBorrowData.loadCoins();
  const variableBorrowIndex = variableBorrowData.loadUintBig(128);
  const currentVariableBorrowRate = variableBorrowData.loadUintBig(128);

  const stableBorrowData = cs.loadRef().beginParse();
  const totalStableDebt = stableBorrowData.loadCoins();
  const stableBorrowIndex = stableBorrowData.loadUintBig(128);
  const currentStableBorrowRate = stableBorrowData.loadUintBig(128);
  const averageStableBorrowRate = stableBorrowData.loadUintBig(128);

  const lastUpdateTimestamp = cs.loadUintBig(128);

  return {
    totalSupply,
    liquidity,
    totalStableDebt,
    totalVariableDebt,
    liquidityIndex,
    stableBorrowIndex,
    variableBorrowIndex,
    currentLiquidityRate,
    currentStableBorrowRate,
    currentVariableBorrowRate,
    averageStableBorrowRate,
    lastUpdateTimestamp,
  };
}

export function parseRateStrategy(cell: Cell): RateStrategy {
  const cs = cell.beginParse();

  const baseVariableBorrowRate = cs.loadUintBig(128);

  const ratioData = cs.loadRef().beginParse();
  const optimalUsageRatio = ratioData.loadUintBig(128);
  const optimalStableToTotalDebtRatio = ratioData.loadUintBig(128);

  const slopeData = cs.loadRef().beginParse();
  const variableRateSlope1 = slopeData.loadUintBig(128);
  const variableRateSlope2 = slopeData.loadUintBig(128);
  const stableRateSlope1 = slopeData.loadUintBig(128);
  const stableRateSlope2 = slopeData.loadUintBig(128);

  const offsetData = cs.loadRef().beginParse();
  const baseStableRateOffset = offsetData.loadUintBig(128);
  const stableRateExcessOffset = offsetData.loadUintBig(128);

  return {
    baseVariableBorrowRate,
    optimalUsageRatio,
    optimalStableToTotalDebtRatio,
    variableRateSlope1,
    variableRateSlope2,
    stableRateSlope1,
    stableRateSlope2,
    baseStableRateOffset,
    stableRateExcessOffset,
  };
}
