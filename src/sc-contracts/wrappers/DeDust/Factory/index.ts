import { Factory } from '@dedust/sdk';
import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';

export class CustomFactory extends Factory {
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {
    super(address);
  }

  static createFromConfig(data: Cell, code: Cell, workchain = 0) {
    const init = { code, data };
    return new CustomFactory(contractAddress(workchain, init), init);
  }
  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
