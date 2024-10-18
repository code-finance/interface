export abstract class Op {
  static TRANSFER = 0xf8a7ea5;
  static TRANSFER_NOTIFICATION = 0x7362d09c;
  static INTERNAL_TRANSFER = 0x178d4519;
  static EXCESSES = 0xd53276db;
  static BURN = 0x595f07bc;
  static BURN_NOTIFICATION = 0x7bdd97de;

  static PROVIDE_WALLET_ADDRESS = 0x2c76b973;
  static TAKE_WALLET_ADDRESS = 0xd1735400;
  static MINT = 21;
  static CHANGE_ADMIN = 3;
  static CHANGE_CONTENT = 4;

  static SUPPLY = 0x1530f236;
  static REPAY = 0x95cded06;
  static REPAY_COLLATERAL = 0x5dfd815f;
  static BORROW = 0xdf316703;
  static WITHDRAW = 0x2572afa4;
  static INIT_RESERVE = 0x36e5ebcb;
  static SET_USE_RESERVE_AS_COLLATERAL = 0xab476844;
  static SWAP = 0x9f404c0a;
}

export abstract class Errors {
  static invalid_op = 709;
  static not_admin = 73;
  static unouthorized_burn = 74;
  static discovery_fee_not_matched = 75;
  static wrong_op = 0xffff;
  static not_owner = 705;
  static not_enough_ton = 709;
  static not_enough_gas = 707;
  static not_valid_wallet = 707;
  static wrong_workchain = 333;
  static balance_error = 706;
}
