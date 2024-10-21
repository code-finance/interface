import { Address, fromNano } from '@ton/core';
import axios from 'axios';
import { formatUnits } from 'ethers/lib/utils';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { retry } from 'ts-retry-promise';

import { useAppTON } from '../useContract';
import { useTonClientV2 } from '../useTonClient';
import { API_TON_V2, MAX_ATTEMPTS_50, PoolContractReservesDataType } from './useAppDataProviderTon';
import { WalletBalancesMap } from './useWalletBalances';

export interface WalletBalancesTop {
  walletBalancesTon: WalletBalancesMap;
  hasEmptyWallet: boolean;
  loading: boolean;
}
export interface TypeBalanceTokensInWalletTon {
  walletBalance: string;
  underlyingAddress: string;
}

export const useGetBalanceTon = () => {
  const AppTON = useAppTON();
  const client2 = useTonClientV2();
  const { isConnectedTonWallet, walletAddressTonWallet } = useTonConnectContext();
  const [balanceTon, setBalanceTon] = useState<string>('0');

  const onGetBalanceTonNetwork = useCallback(
    async (tokenAddress: string, yourAddress: string, decimals: string | number) => {
      if (!AppTON) {
        console.warn('AppTON is not available.');
        return '0';
      }

      if (!yourAddress) {
        console.warn('Wallet address is not available.');
        return '0';
      }

      if (!tokenAddress) {
        console.warn('Token address is not provided.');
        return '0';
      }

      try {
        const balance = await retry(
          async () => {
            // Parse token and user wallet addresses
            const parsedTokenAddress = Address.parse(tokenAddress);
            const parsedWalletAddress = Address.parse(yourAddress);

            // Retrieve the Jetton Wallet address for the user
            const fetchedBalance = await AppTON.getJettonBalance(
              parsedWalletAddress,
              parsedTokenAddress
            );

            // Format and return the balance using the provided decimals
            return formatUnits(fetchedBalance || '0', decimals);
          },
          {
            retries: MAX_ATTEMPTS_50, // Maximum number of retries
            delay: 1000, // Delay between retries (1 second)
          }
        );

        return balance; // Return balance on success
      } catch (error) {
        console.error('Failed to fetch balance after retries:', error);
        return '0'; // Return '0' after max attempts
      }
    },
    [AppTON]
  );

  const getBalanceTokenTonOld = useCallback(async (youAddress?: string) => {
    if (!youAddress) return '0';

    try {
      const balance = await retry(
        async () => {
          const params = { address: youAddress };
          const res = await axios.get(`${API_TON_V2}/getAddressInformation`, { params });
          const balance = res.data.result.balance;

          // Convert balance from Nano format and return as string
          return fromNano(balance).toString();
        },
        {
          retries: 100, // Maximum number of retries
          delay: 2000, // Delay between retries (2 second)
        }
      );

      return balance; // Return fetched balance
    } catch (error) {
      console.error('Failed to fetch getBalanceTokenTon after retries:', error);
      return '0'; // Return '0' if maximum attempts are reached
    }
  }, []);

  const getBalanceTokenTon = useCallback(
    async (walletAddressTonWallet: string) => {
      if (!client2 || !isConnectedTonWallet) {
        setBalanceTon('0');
        return '0';
      }
      try {
        const walletAddress = Address.parse(walletAddressTonWallet);
        const balanceData = await client2.getBalance(walletAddress);

        const balance = fromNano(balanceData).toString();

        setBalanceTon(balance);
        return balance;
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalanceTon('0');
        return '0';
      }
    },
    [client2, isConnectedTonWallet]
  );

  useEffect(() => {
    getBalanceTokenTon(walletAddressTonWallet);
  }, [getBalanceTokenTon, walletAddressTonWallet, isConnectedTonWallet]);

  const onGetBalancesTokenInWalletTon = useCallback(
    async (
      poolContractReservesData: PoolContractReservesDataType[],
      yourAddress: string,
      isConnected: boolean
    ) => {
      let hasError = false; // Track if there were any errors during the process

      // Fetch all balances for the given pool reserves data
      const balances = await Promise.all(
        poolContractReservesData.map(async (item) => {
          const { decimals, underlyingAddress, isJetton } = item;
          let walletBalance = '0';

          if (isConnected) {
            try {
              // Fetch balance based on token type: Jetton or standard token
              walletBalance = isJetton
                ? await onGetBalanceTonNetwork(underlyingAddress.toString(), yourAddress, decimals)
                : await getBalanceTokenTonOld(yourAddress);
            } catch (error) {
              console.error(`Error fetching balance for token ${underlyingAddress}:`, error);
              hasError = true; // Set error flag to true in case of error
            }
          } else {
            console.warn('Not connected: Assuming all balances are zero.');
          }

          // Return the calculated wallet balance along with the underlying address
          return {
            walletBalance,
            underlyingAddress: underlyingAddress.toString().toLocaleLowerCase(),
          };
        })
      );

      // Log a message if there were errors, but return the balances regardless
      if (hasError) {
        console.warn(
          'Some balances could not be fetched successfully due to errors. Please check the logs for details.'
        );
      }

      return balances; // Return the final list of balances
    },
    [getBalanceTokenTonOld, onGetBalanceTonNetwork]
  );

  return {
    onGetBalanceTonNetwork,
    onGetBalancesTokenInWalletTon,
    getBalanceTokenTonOld,
  };
};

export const useWalletBalancesTon = (reservesTon: DashboardReserve[]): WalletBalancesTop => {
  const [walletBalancesTon, setWalletBalancesTon] = useState<WalletBalancesMap>({});
  const [loading, setLoading] = useState<boolean>(false);
  useMemo(() => {
    setLoading(true);
    if (!reservesTon) return;
    const transformedData: WalletBalancesMap = {};
    reservesTon.forEach((item) => {
      const address = item.underlyingAsset;
      transformedData[address] = {
        amount: item.walletBalance,
        amountUSD: item.walletBalanceUSD,
      };
    });
    setWalletBalancesTon(transformedData);
    setLoading(false);
  }, [reservesTon]);

  return {
    walletBalancesTon,
    hasEmptyWallet: _.isEmpty(walletBalancesTon),
    loading: loading,
  };
};
