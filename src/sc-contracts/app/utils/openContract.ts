import { Contract } from '@ton/core';
import { Blockchain } from '@ton/sandbox';
import { TonClient4 } from '@ton/ton';

import { Provider } from '../types';

export function openContract<T extends Contract>(provider: Provider, contract: T) {
  if (provider instanceof Blockchain) {
    return provider.openContract(contract);
  }

  if (provider instanceof TonClient4) {
    return provider.open(contract);
  }

  throw new Error('Invalid provider type');
}
