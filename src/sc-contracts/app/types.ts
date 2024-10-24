import { Blockchain, SandboxContract } from '@ton/sandbox';
import { Address, Contract, OpenedContract, TonClient4 } from '@ton/ton';

export type DeployedContract<T extends Contract> = SandboxContract<T> | OpenedContract<T>;

export type Jettons = { [k in ReserveKeys]: Address };

export type Provider = Blockchain | TonClient4;

export type ReserveKeys = 'TON' | 'USDT' | 'USDC' | 'DAI';

export type IReserveConfig = {
  LTV: number;
  liquidationThreshold: number;
  isActive: boolean;
  isBorrowingEnabled: boolean;
  stableRateBorrowingEnabled: boolean;
  isFrozen: boolean;
  isPaused: boolean;
  isJetton: boolean;
  reserveFactor: number;
  supplyCap: bigint;
  borrowCap: bigint;
  debtCeiling: bigint;
};

export type IRateStrategy = {
  optimalUsageRatio: bigint;
  baseVariableBorrowRate: bigint;
  variableRateSlope1: bigint;
  variableRateSlope2: bigint;
  stableRateSlope1: bigint;
  stableRateSlope2: bigint;
  baseStableRateOffset: bigint;
  stableRateExcessOffset: bigint;
  optimalStableToTotalDebtRatio: bigint;
};
