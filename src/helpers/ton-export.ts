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
export const GAS_FEE_REPAY_TON_TON_NETWORK = 0.15;
export const GAS_FEE_REPAY_JETTONS_TON_NETWORK = 0.25;
export const GAS_FEE_COLLATERAL_TON_NETWORK = 0.25;

export const defaultRateUSDNotValue = [
  {
    id: 'ts-ton',
    address: 'EQD42OQYC4nGc3KbrcKpOKkZMz831WkqDC8fio-pgDUi_oHe',
    usd: '0',
  },
  {
    id: 'st-ton',
    address: 'EQCsiCNW3mqOx-GqcpeP1t-0P0z6nzgq1h_n_b10neKKjWFk',
    usd: '0',
  },
  {
    id: 'dai',
    address: 'EQDPC-_3w_fGyJd-gxxmP8CO_zQC2i3dt-B4D-lNQFwD_YvO',
    usd: '0',
  },
  {
    id: 'usd-coin',
    address: 'EQAw6XehcP3V5DEc6uC9F1lUTOLXjElDOpGmNLVZzZPn4E3y',
    usd: '0',
  },
  // usdt old
  {
    id: 'tether',
    address: 'EQD1h97vd0waJaIsqwYN8BOffL1JJPExBFCrrIgCHDdLeSjO',
    usd: '0',
  },
  {
    id: 'tether',
    address: 'EQCcZvU9dbEQNeCWup5FB7ixsr0K-mRm2fT_ETq6hrFBLVZk',
    usd: '0',
  },
  {
    id: 'the-open-network',
    address: address_pools,
    usd: '0',
  },
];
