export const FACTORY_DEDUST = process.env.NEXT_PUBLIC_FACTORY_DEDUST_TESTNET || '';
export const address_pools = process.env.NEXT_PUBLIC_ADDRESS_POOL_TESTNET || '';
export const MAX_ATTEMPTS = 100;
export const MAX_ATTEMPTS_50 = 50;
export const GAS_FEE_TON = 0.3;
export const API_TON_V2 = process.env.NEXT_PUBLIC_API_TON_V2_TESTNET;
export const API_TON_V3 = process.env.NEXT_PUBLIC_API_TON_V3_TESTNET;
export const API_TON_SCAN_V2 = process.env.NEXT_PUBLIC_API_TON_SCAN_V2_TESTNET;
export const SCAN_TRANSACTION_TON = process.env.NEXT_PUBLIC_SCAN_TRANSACTION_TON_TESTNET;
export const TREASURY_ADDRESS = process.env.NEXT_PUBLIC_ADDRESS_TREASURY;
export const URL_API_BE = process.env.NEXT_PUBLIC_URL_API_BE || '';
export const SCAN_PRICE_TON = process.env.NEXT_PUBLIC_SCAN_PRICE_TON;
export const URL_PUBLIC = process.env.NEXT_PUBLIC_URL_PUBLIC;
export const ADDRESS_USDT = process.env.NEXT_PUBLIC_ADDRESS_USDT || '';
export const ADDRESS_USDT_OLD = process.env.NEXT_PUBLIC_ADDRESS_USDT_OLD || '';
export const ADDRESS_USDC = process.env.NEXT_PUBLIC_ADDRESS_USDC || '';
export const ADDRESS_DAI = process.env.NEXT_PUBLIC_ADDRESS_DAI || '';
export const ADDRESS_ST_TON = process.env.NEXT_PUBLIC_ADDRESS_ST_TON || '';
export const ADDRESS_TS_TON = process.env.NEXT_PUBLIC_ADDRESS_TS_TON || '';
// export const SANDBOX_V4_API_ENDPOINT = 'https://sandbox-v4.tonhubapi.com'; // testnet
// export const MAINNET_V4_API_ENDPOINT = 'https://mainnet-v4.tonhubapi.com'; // mainnet

// export const OP_CODE_SUPPLY_TON = '0x1530f236';
// export const OP_CODE_SUPPLY_JETTON = '0x7362d09c';
export const OP_CODE_SUPPLY = '0x1530f236';
export const OP_CODE_BORROW = '0xdf316703';
export const OP_CODE_REPAY = '0x95cded06';
export const OP_CODE_REPAY_COLLATERAL = '0x5dfd815f';
export const OP_CODE_WITHDRAW = '0x2572afa4';
export const OP_CODE_COLLATERAL_UPDATE = '0xab476844';
export const LIQUIDATION = '0x84672e48';

export const GAS_FEE_SUPPLY_TON_TON_NETWORK = 0.15;
export const GAS_FEE_SUPPLY_JETTONS_TON_NETWORK = 0.25;
export const GAS_FEE_BORROW_TON_NETWORK = 0.2;
export const GAS_FEE_WITHDRAW_TON_NETWORK = 0.2;
export const GAS_FEE_REPAY_TON_TON_NETWORK = 0.18;
export const GAS_FEE_REPAY_JETTONS_TON_NETWORK = 0.25;
export const GAS_FEE_COLLATERAL_TON_NETWORK = 0.25;

export const defaultRateUSDNotValue = [
  {
    id: 'ts-ton',
    address: ADDRESS_TS_TON,
    usd: '0',
  },
  {
    id: 'st-ton',
    address: ADDRESS_ST_TON,
    usd: '0',
  },
  {
    id: 'dai',
    address: ADDRESS_DAI,
    usd: '0',
  },
  {
    id: 'usd-coin',
    address: ADDRESS_USDC,
    usd: '0',
  },
  // usdt old
  {
    id: 'tether',
    address: ADDRESS_USDT_OLD,
    usd: '0',
  },
  {
    id: 'tether',
    address: ADDRESS_USDT,
    usd: '0',
  },
  {
    id: 'the-open-network',
    address: address_pools,
    usd: '0',
  },
];
