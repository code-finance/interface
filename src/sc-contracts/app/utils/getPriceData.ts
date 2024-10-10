import { Cell, Dictionary } from '@ton/core';
import { Blockchain } from '@ton/sandbox';

import { getMultiSig } from '../../wrappers';
import { Jettons, Provider } from '../types';

export async function getPriceData(
  provider: Provider,
  jettons?: Jettons
): Promise<Dictionary<bigint, Cell>> {
  if (provider instanceof Blockchain) {
    console.log('here');
    return getMultiSig({ isMock: true, ...jettons });
  }

  return getMultiSig({ isMock: false });
}
