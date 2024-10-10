import { Address, Contract, OpenedContract } from '@ton/core';
import { useAsyncInitialize } from 'src/hooks/useAsyncInitialize';
import { useTonClient } from 'src/hooks/useTonClient';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { App } from 'src/sc-contracts/app';

import { address_pools } from './app-data-provider/useAppDataProviderTon';

export function useContract<T extends Contract>(
  contractAddress: string,
  ContractClass: new (address: Address) => T
): OpenedContract<T> | undefined {
  const client = useTonClient();
  const { walletAddressTonWallet } = useTonConnectContext();

  return useAsyncInitialize(async () => {
    if (!client || !walletAddressTonWallet) return;
    const contract = new ContractClass(Address.parse(contractAddress));
    return client.open(contract) as OpenedContract<T>;
  }, [client, walletAddressTonWallet]);
}

export function useContractUnNotAuth<T extends Contract>(
  contractAddress: string,
  ContractClass: new (address: Address) => T
): OpenedContract<T> | undefined {
  const client = useTonClient();

  return useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new ContractClass(Address.parse(contractAddress));
    return client.open(contract) as OpenedContract<T>;
  }, [client]);
}

export function useTonApp(): App | undefined {
  const client = useTonClient();

  return useAsyncInitialize(async () => {
    if (!client) return;
    return new App(client, Address.parse(address_pools));
  }, [client]);
}
