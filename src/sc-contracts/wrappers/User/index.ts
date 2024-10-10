import { Address, Cell, Contract, ContractProvider } from '@ton/core';

export class User implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new User(address);
  }

  async getPoolAddress(provider: ContractProvider): Promise<Address> {
    const { stack } = await provider.get('get_pool_address', []);
    return stack.readAddress();
  }

  async getReserves(provider: ContractProvider) {
    const { stack } = await provider.get('get_reserves', []);
    const data = stack.readTuple();

    const reserves = [];
    while (data.remaining) {
      reserves.push(data.readAddress());
    }

    return reserves;
  }

  async getUserSupplyData(provider: ContractProvider) {
    const { stack } = await provider.get('get_supply_data', []);
    return stack.readTuple();
  }

  async getUserData(provider: ContractProvider) {
    try {
      const { stack } = await provider.get('get_user_data', []);
      const reserves = stack.readTuple();
      const supplies = stack.readTuple();
      const variableBorrowings = stack.readTuple();
      const stableBorrowings = stack.readTuple();
      const result = [];
      while (reserves.remaining) {
        let ds, vs, ss;
        // eslint-disable-next-line prefer-const
        ds = supplies.readCellOpt()?.beginParse();
        // eslint-disable-next-line prefer-const
        vs = variableBorrowings.readCellOpt()?.beginParse();
        // eslint-disable-next-line prefer-const
        ss = stableBorrowings.readCellOpt()?.beginParse();
        const underlyingAddress = reserves.readAddress();
        result.push({
          totalSupply: ds?.loadCoins() || 0,
          liquidityIndex: ds?.loadUintBig(128) || BigInt('1000000000000000000000000000'),
          isCollateral: ds?.loadBoolean(),
          variableBorrowBalance: vs?.loadCoins() || 0,
          variableBorrowIndex: vs ? vs.loadUintBig(128) : BigInt('1000000000000000000000000000'),
          stableBorrowBalance: ss?.loadCoins() || 0,
          stableBorrowRate: ss?.loadUintBig(128) || BigInt('0'),
          stableLastUpdateTimestamp: ss?.loadUintBig(128) || BigInt('0'),
          underlyingAddress,
        });
      }
      return result;
    } catch (error) {
      console.log('getUserData error', error);
      return [];
    }
  }
}
