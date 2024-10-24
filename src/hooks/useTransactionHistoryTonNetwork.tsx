import { Address } from '@ton/core';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  actionFilterMap,
  hasCollateralReserve,
  hasPrincipalReserve,
  hasReserve,
  HistoryFilters,
  TransactionHistoryItemUnion,
} from 'src/modules/history/types';
import { useRootStore } from 'src/store/root';
import { retry } from 'ts-retry-promise';

import { useAppDataContext } from './app-data-provider/useAppDataProvider';
import {
  address_pools,
  MAX_ATTEMPTS_50,
  URL_API_BE,
} from './app-data-provider/useAppDataProviderTon';

export const applyTxHistoryFilters = ({
  searchQuery,
  filterQuery,
  txns,
}: HistoryFilters & { txns: TransactionHistoryItemUnion[] }) => {
  let filteredTxns: TransactionHistoryItemUnion[];

  // Apply search filter
  if (searchQuery.length > 0) {
    const lowerSearchQuery = searchQuery.toLowerCase();

    filteredTxns = txns.filter((txn: TransactionHistoryItemUnion) => {
      let collateralSymbol = '';
      let principalSymbol = '';
      let collateralName = '';
      let principalName = '';
      let symbol = '';
      let name = '';

      if (hasCollateralReserve(txn)) {
        collateralSymbol = txn.collateralReserve.symbol.toLowerCase();
        collateralName = txn.collateralReserve.name.toLowerCase();
      }

      if (hasPrincipalReserve(txn)) {
        principalSymbol = txn.principalReserve.symbol.toLowerCase();
        principalName = txn.principalReserve.name.toLowerCase();
      }

      if (hasReserve(txn)) {
        symbol = txn.reserve.symbol.toLowerCase();
        name = txn.reserve.name.toLowerCase();
      }

      // handle special case where user searches for ethereum but asset names are abbreviated as ether
      const altName = name.includes('ether') && !name.includes('tether') ? 'ethereum' : '';

      return (
        symbol.includes(lowerSearchQuery) ||
        collateralSymbol.includes(lowerSearchQuery) ||
        principalSymbol.includes(lowerSearchQuery) ||
        name.includes(lowerSearchQuery) ||
        altName.includes(lowerSearchQuery) ||
        collateralName.includes(lowerSearchQuery) ||
        principalName.includes(lowerSearchQuery)
      );
    });
  } else {
    filteredTxns = txns;
  }

  // apply txn type filter
  if (filterQuery.length > 0) {
    filteredTxns = filteredTxns.filter((txn: TransactionHistoryItemUnion) => {
      if (filterQuery.includes(actionFilterMap(txn.action))) {
        return true;
      } else {
        return false;
      }
    });
  }
  return filteredTxns;
};

export const useTransactionHistoryTonNetwork = () => {
  const [account] = useRootStore((state) => [state.account]);

  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isConnectNetWorkTon } = useAppDataContext();

  const getTransactionsHistory = useCallback(async () => {
    if (!isConnectNetWorkTon || !account) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      await retry(
        async () => {
          if (!address_pools || !account) return;
          const encodedPool = encodeURI(Address.parse(address_pools.toString()).toRawString());
          const encodedAccount = encodeURI(Address.parse(account).toRawString());

          const params = {
            pool: encodedPool,
            address: encodedAccount,
            page: 0,
            limit: 100,
          };

          const { data } = await axios.get(`${URL_API_BE}/crawler/transaction-history`, {
            params,
          });

          setTransactions(data);
          setIsLoading(false);
        },
        {
          retries: MAX_ATTEMPTS_50, // Maximum number of retries
          delay: 1000, // Delay between retries (1 second)
        }
      );
    } catch (error) {
      console.error('Failed to fetch supplies after retries:', error);
      setTransactions([]);
      setIsLoading(false);
    }
  }, [isConnectNetWorkTon, account]);

  useEffect(() => {
    setIsLoading(true);
    getTransactionsHistory();
  }, [getTransactionsHistory, isConnectNetWorkTon, account]);

  return {
    data: transactions,
    isLoading,
    fetchForDownload: null,
    subgraphUrl: '',
  };
};
