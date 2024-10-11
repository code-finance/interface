import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  toNano,
} from '@ton/core';

import { readJettonMetadata } from '../JettonMinter/helpers/jetton-metadata';
import { User } from '../User';
import {
  BorrowParamsToCell,
  InitReserveParamsToCell,
  PoolConfigToCell,
  RepayCollateralParamsToCell,
  RepayParamsToCell,
  SetUseReserveAsCollateralParamsToCell,
  SupplyParamsToCell,
  WithdrawParamsToCell,
} from './builder';
import { parseRateStrategy, parseReserveConfig, parseReserveState } from './parser';
import {
  BorrowParams,
  InitReserveParams,
  PoolConfig,
  RepayCollateralParams,
  RepayParams,
  SetUseReserveAsCollateralParams,
  SupplyParams,
  WithdrawParams,
} from './types';

export class Pool implements Contract {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

  static createFromAddress(address: Address) {
    return new Pool(address);
  }

  static createFromConfig(config: PoolConfig, code: Cell, workchain = 0) {
    const data = PoolConfigToCell(config);
    const init = { code, data };
    return new Pool(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendInitReserve(provider: ContractProvider, via: Sender, params: InitReserveParams) {
    const body = InitReserveParamsToCell(params);
    await provider.internal(via, {
      value: toNano('0.05'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendSupply(provider: ContractProvider, via: Sender, params: SupplyParams) {
    const body = SupplyParamsToCell(params);
    await provider.internal(via, {
      value: params.amount + toNano('0.05'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendBorrow(provider: ContractProvider, via: Sender, params: BorrowParams) {
    const body = BorrowParamsToCell(params);
    await provider.internal(via, {
      value: toNano('0.15'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendWithdraw(provider: ContractProvider, via: Sender, params: WithdrawParams) {
    const body = WithdrawParamsToCell(params);
    await provider.internal(via, {
      value: toNano('0.15'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendRepay(provider: ContractProvider, via: Sender, params: RepayParams) {
    const body = RepayParamsToCell(params);
    await provider.internal(via, {
      value: toNano('0.15'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendSetUseReserveAsCollateral(
    provider: ContractProvider,
    via: Sender,
    params: SetUseReserveAsCollateralParams
  ) {
    const body = SetUseReserveAsCollateralParamsToCell(params);
    await provider.internal(via, {
      value: toNano('0.05'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    });
  }

  async sendRepayCollateral(
    provider: ContractProvider,
    via: Sender,
    params: RepayCollateralParams
  ) {
    await provider.internal(via, {
      value: toNano('0.2'),
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: RepayCollateralParamsToCell(params),
    });
  }

  /** GETTERS */
  async getAdmin(provider: ContractProvider): Promise<Address> {
    const { stack } = await provider.get('get_admin', []);
    return stack.readAddress();
  }

  async getUserAddress(provider: ContractProvider, ownerAddress: Address) {
    const { stack } = await provider.get('get_user_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(ownerAddress).endCell(),
      },
    ]);
    return stack.readAddress();
  }

  async getReserveList(provider: ContractProvider) {
    const { stack } = await provider.get('get_reserve_list', []);
    const list = stack.readTuple();

    const reserves = [];
    while (list.remaining) {
      reserves.push(list.readBigNumber());
    }

    return reserves;
  }

  async getReserveConfig(provider: ContractProvider, underlyingAsset: Address) {
    const { stack } = await provider.get('get_reserve_config', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(underlyingAsset).endCell(),
      },
    ]);

    const data = stack.readCellOpt();
    if (!data) {
      return { data: null, flag: false };
    }

    const ds = data.beginParse();
    const addresses = ds.loadRef().beginParse();
    const underlyingAddress = addresses.loadAddress();
    const poolJWAddress = addresses.loadAddress();
    const flag = stack.readBoolean();
    return { data, flag };
  }

  async getReservesData(provider: ContractProvider) {
    const { stack } = await provider.get('get_reserves_data', []);
    const states = stack.readTupleOpt();
    const configs = stack.readTupleOpt();
    const strategies = stack.readTupleOpt();

    if (configs === null || states === null || strategies === null) {
      return [];
    }

    const reserves = [];
    while (configs.remaining && states.remaining && strategies.remaining) {
      const config = parseReserveConfig(configs.readCell());
      const state = parseReserveState(states.readCell());
      const strategy = parseRateStrategy(strategies.readCell());
      const { metadata } = await readJettonMetadata(config.content);
      delete config.content;
      reserves.push({ ...config, ...metadata, ...state, ...strategy });
    }

    return reserves;
  }

  async getReserveNormalizedIncome(provider: ContractProvider, poolJWAddress: Address) {
    const { stack } = await provider.get('get_reserve_normalized_income', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(poolJWAddress).endCell(),
      },
    ]);
    return stack.readBigNumber();
  }

  async getReserveData(provider: ContractProvider, poolJWAddress: Address) {
    const { stack } = await provider.get('get_reserve_data', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(poolJWAddress).endCell(),
      },
    ]);

    const stateCell = stack.readCellOpt();
    const configCell = stack.readCellOpt();
    const strategyCell = stack.readCellOpt();

    if (stateCell === null || configCell === null || strategyCell === null) {
      return null;
    }

    const state = parseReserveState(stateCell);
    const config = parseReserveConfig(configCell);
    const strategy = parseRateStrategy(strategyCell);

    const { metadata } = await readJettonMetadata(config.content);
    delete config.content;

    return {
      ...state,
      ...config,
      ...strategy,
      ...metadata,
    };
  }

  async getUserData(provider: ContractProvider, ownerAddress: Address) {
    const { stack } = await provider.get('get_user_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(ownerAddress).endCell(),
      },
    ]);
    const userAddress = stack.readAddress();
    const userContract = provider.open(User.createFromAddress(userAddress));
    try {
      return await userContract.getUserData();
    } catch (err) {
      console.log('Error Log: ', err);
      return [];
    }
  }
}

export * from './builder';
export * from './types';
