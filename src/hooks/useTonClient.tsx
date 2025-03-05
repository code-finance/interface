import { getHttpEndpoint, getHttpV4Endpoint } from '@orbs-network/ton-access';
import { TonClient, TonClient4 } from '@ton/ton';

import { useAsyncInitialize } from './useAsyncInitialize';
import { NETWORK_TON } from 'src/helpers/ton-export';

export function useTonClient() {
  return useAsyncInitialize(
    async () =>
      new TonClient4({
        endpoint: await getHttpV4Endpoint({
          network: typeof NETWORK_TON === 'string' ? NETWORK_TON : 'mainnet',
        }),
      })
  );
}

export function useTonClientV2() {
  return useAsyncInitialize(
    async () =>
      new TonClient({
        endpoint: await getHttpEndpoint({
          network: typeof NETWORK_TON === 'string' ? NETWORK_TON : 'mainnet',
        }),
      })
  );
}
