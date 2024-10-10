import { Address, Cell, Dictionary } from '@ton/core';

export type PoolConfig = {
  admin: Address;
  userCode: Cell;
  bePublicKey: Buffer;
};

export type ReserveConfig = {
  underlyingAddress: Address;
  poolJWAddress: Address;
  decimals: number;
  LTV: number;
  liquidationThreshold: number;
  isActive: boolean;
  isFrozen: boolean;
  isBorrowingEnabled: boolean;
  stableRateBorrowingEnabled: boolean;
  isPaused: boolean;
  isJetton: boolean;
  reserveFactor: number;
  supplyCap: bigint;
  borrowCap: bigint;
  debtCeiling: bigint;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Cell | any;
};

export type RateStrategy = {
  baseVariableBorrowRate: bigint;
  optimalUsageRatio: bigint;
  optimalStableToTotalDebtRatio: bigint;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  stableRateSlope1: bigint;
  stableRateSlope2: bigint;
  baseStableRateOffset: bigint;
  stableRateExcessOffset: bigint;
};

export type ReserveState = {
  totalSupply: bigint;
  liquidity: bigint;
  totalStableDebt: bigint;
  totalVariableDebt: bigint;
  liquidityIndex: bigint;
  stableBorrowIndex: bigint;
  variableBorrowIndex: bigint;
  currentLiquidityRate: bigint;
  currentStableBorrowRate: bigint;
  currentVariableBorrowRate: bigint;
  averageStableBorrowRate: bigint;
  lastUpdateTimestamp: bigint;
  accruedToTreasury?: bigint;
};

export type ReserveData = ReserveConfig & ReserveState & RateStrategy;

export type InitReserveParams = {
  poolJWAddress: Address;
  reserveConfig: ReserveConfig;
  rateStrategy: RateStrategy;
};

export type SupplyParams = {
  amount: bigint;
  poolJWAddress: Address;
};

export type BorrowParams = {
  poolJWAddress: Address;
  amount: bigint;
  interestRateMode: number;
  priceData: Dictionary<bigint, Cell>;
};

export type WithdrawParams = {
  poolJWAddress: Address;
  amount?: bigint;
  isMaxWithdraw?: boolean;
  priceData: Dictionary<bigint, Cell>;
};

export type SetUseReserveAsCollateralParams = {
  poolJWAddress: Address;
  useAsCollateral: boolean;
  priceData: Dictionary<bigint, Cell>;
};

export type RepayParams = {
  poolJWRepay?: Address;
  poolJWCollateral?: Address;
  amount: bigint;
  amountCollateral: bigint;
  interestRateMode: number;
  isMax: boolean;
  priceData: Dictionary<bigint, Cell>;
  vaultAddress?: Address;
  swapPoolAddress?: Address;
};
