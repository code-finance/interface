import { DocumentDownloadIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ConnectWalletPaper } from 'src/components/ConnectWalletPaper';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { SearchInput } from 'src/components/SearchInput';
import { applyTxHistoryFilters, useTransactionHistory } from 'src/hooks/useTransactionHistory';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { TRANSACTION_HISTORY } from 'src/utils/mixPanelEvents';

import { downloadData, formatTransactionData, groupByDate } from './helpers';
import { HistoryFilterMenu } from './HistoryFilterMenu';
import { HistoryItemLoader } from './HistoryItemLoader';
import { HistoryWrapperMobile } from './HistoryWrapperMobile';
import TransactionRowItem from './TransactionRowItem';
import {
  ACTION_HISTORY,
  defaultNameAsset,
  defaultUnderlyingAsset,
  FilterOptions,
  TransactionHistoryItemUnion,
} from './types';
import { useSocketGetRateUSD } from 'src/hooks/app-data-provider/useSocketGetRateUSD';
import { useAppDataProviderTon } from 'src/hooks/app-data-provider/useAppDataProviderTon';

export const HistoryWrapper = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [filterQuery, setFilterQuery] = useState<FilterOptions[]>([]);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const currentMarketData = useRootStore((state) => state.currentMarketData);
  const { isConnectedTonWallet } = useTonConnectContext();
  const checkTonNetwork = isConnectedTonWallet && currentMarketData.marketTitle === 'TON';
  const isFilterActive = searchQuery.length > 0 || filterQuery.length > 0;
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { ExchangeRateListUSD } = useSocketGetRateUSD();
  const { reservesTon } = useAppDataProviderTon(ExchangeRateListUSD);

  const {
    data: transactions,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    subgraphUrl,
    fetchForDownload,
  } = useTransactionHistory({ isFilterActive });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, isLoading]
  );
  const theme = useTheme();
  const downToMD = useMediaQuery(theme.breakpoints.down('md'));
  const { currentAccount, loading: web3Loading } = useWeb3Context();

  console.log('Default transactions: ', transactions);

  const flatTxns = useMemo(() => {
    console.log('Memo Transactions updated: ', transactions);
    return transactions?.pages?.flatMap((page) => page) || [];
  }, [transactions]);

  const filteredTxns: TransactionHistoryItemUnion[] = useMemo(() => {
    const txnArray = Array.isArray(flatTxns) ? flatTxns : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedTxns = txnArray.map((item: any) => {
      const action = ACTION_HISTORY[item.opCode as keyof typeof ACTION_HISTORY] || 'Unknown Action';

      const poolId = item.pool ?? null;
      if (poolId) {
        item = { ...item };
        delete item.pool;
      }

      const underlyingAsset =
        defaultUnderlyingAsset[item.symbol as keyof typeof defaultUnderlyingAsset];
      const name = defaultNameAsset[item.symbol as keyof typeof defaultNameAsset];

      const reserveName = name || 'Unknown Name';
      const reserveAsset = underlyingAsset || 'Unknown Asset';
      const collateralStatus = item.collateralStatus === 'disable' ? false : true;

      if (
        action === 'Supply' ||
        action === 'Repay' ||
        action === 'Withdraw' ||
        action === 'Borrow' ||
        action === 'UsageAsCollateral' ||
        action === 'RedeemUnderlying'
      ) {
        item.pool = {
          id: poolId,
        };
        item.reserve = {
          symbol: item.symbol,
          decimals: item.decimals,
          underlyingAsset: reserveAsset,
          name: reserveName,
        };
      } else {
        console.log('Item not match with action: ', item);
      }
      let assetPriceUSD = '1';
      if (reservesTon && reservesTon.length) {
        if (item.symbol === 'TON') {
          console.log('item.symbol: ', item.symbol);
        }
        assetPriceUSD =
          reservesTon.find((subItem) => subItem.symbol === item.symbol)?.priceInUSD.toString() ??
          '1';
      }
      const iconSymbol = item.symbol;
      console.log('Symbol', item.symbol, 'AssetPriceUSD: ', assetPriceUSD);
      return { ...item, action, iconSymbol, toState: collateralStatus, assetPriceUSD };
    });

    return applyTxHistoryFilters({ searchQuery, filterQuery, txns: updatedTxns });
  }, [searchQuery, filterQuery, flatTxns, reservesTon]);

  if (isLoading || isFetchingNextPage) {
    return (
      <>
        <HistoryItemLoader />
        <HistoryItemLoader />
      </>
    );
  }

  if (!currentAccount) {
    return (
      <ConnectWalletPaper
        loading={web3Loading}
        description={<Trans> Please connect your wallet to view transaction history.</Trans>}
      />
    );
  }

  if (!checkTonNetwork && !subgraphUrl) {
    return (
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          p: 4,
          flex: 1,
        }}
      >
        <Typography variant={downToMD ? 'h4' : 'h3'}>
          <Trans>Transaction history is not currently available for this market</Trans>
        </Typography>
      </Paper>
    );
  }

  if (downToMD) {
    return <HistoryWrapperMobile />;
  }

  const isEmpty = filteredTxns.length === 0;
  const filterActive = searchQuery !== '' || filterQuery.length > 0;

  const handleJsonDownload = async () => {
    trackEvent(TRANSACTION_HISTORY.DOWNLOAD, { type: 'JSON' });
    setLoadingDownload(true);
    const data = await fetchForDownload({ searchQuery, filterQuery });
    const formattedData = formatTransactionData({ data, csv: false });
    const jsonData = JSON.stringify(formattedData, null, 2);
    downloadData('transactions.json', jsonData, 'application/json');
    setLoadingDownload(false);
  };

  const handleCsvDownload = async () => {
    trackEvent(TRANSACTION_HISTORY.DOWNLOAD, { type: 'CSV' });

    setLoadingDownload(true);
    const data: TransactionHistoryItemUnion[] = await fetchForDownload({
      searchQuery,
      filterQuery,
    });
    const formattedData = formatTransactionData({ data, csv: true });

    // Getting all the unique headers
    const headersSet = new Set<string>();
    formattedData.forEach((transaction: TransactionHistoryItemUnion) => {
      Object.keys(transaction).forEach((key) => headersSet.add(key));
    });

    const headers: string[] = Array.from(headersSet);
    let csvContent = headers.join(',') + '\n';

    formattedData.forEach((transaction: TransactionHistoryItemUnion) => {
      const row: string[] = headers.map((header) => {
        const value = transaction[header as keyof TransactionHistoryItemUnion];
        if (typeof value === 'object') {
          return JSON.stringify(value) ?? '';
        }
        return String(value) ?? '';
      });
      csvContent += row.join(',') + '\n';
    });

    downloadData('transactions.csv', csvContent, 'text/csv');
    setLoadingDownload(false);
  };

  return (
    <ListWrapper
      paperSx={(theme) => ({ backgroundColor: theme.palette.background.primary })}
      titleComponent={
        <Typography component="div" variant="h2" sx={{ mr: 4 }}>
          <Trans>Transactions</Trans>
        </Typography>
      }
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'inline-flex' }}>
          <HistoryFilterMenu
            onFilterChange={setFilterQuery}
            currentFilter={filterQuery}
            checkTonNetwork
          />
          <SearchInput
            onSearchTermChange={setSearchQuery}
            placeholder="Search assets..."
            wrapperSx={{ width: '280px', ml: 2 }}
            key={searchResetKey}
          />
        </Box>
        {!checkTonNetwork && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 36, gap: 0.5 }}>
              {loadingDownload && <CircularProgress size={16} sx={{ mr: 2 }} color="inherit" />}
              <Box
                sx={{
                  cursor: 'pointer',
                  color: 'primary',
                  height: 'auto',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  mr: 6,
                }}
                onClick={handleCsvDownload}
              >
                <SvgIcon>
                  <DocumentDownloadIcon width={22} height={22} />
                </SvgIcon>
                <Typography variant="buttonM" color="text.primary">
                  <Trans>.CSV</Trans>
                </Typography>
              </Box>
              <Box
                sx={{
                  cursor: 'pointer',
                  color: 'primary',
                  height: 'auto',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={handleJsonDownload}
              >
                <SvgIcon>
                  <DocumentDownloadIcon width={22} height={22} />
                </SvgIcon>
                <Typography variant="buttonM" color="text.primary">
                  <Trans>.JSON</Trans>
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>

      {isLoading ? (
        <>
          <HistoryItemLoader />
          <HistoryItemLoader />
        </>
      ) : !isEmpty && filteredTxns ? (
        Object.entries(groupByDate(filteredTxns))?.map(([date, txns], groupIndex) => (
          <div key={groupIndex} style={{ padding: 8 }}>
            <Typography variant="body4" color="text.subTitle" sx={{ mt: 15, mb: 2 }}>
              {date}
            </Typography>
            {txns.map((transaction: TransactionHistoryItemUnion, index: number) => {
              const isLastItem = index === txns.length - 1;
              return (
                <div ref={isLastItem ? lastElementRef : null} key={index}>
                  <TransactionRowItem transaction={transaction as TransactionHistoryItemUnion} />
                </div>
              );
            })}
          </div>
        ))
      ) : filterActive ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            flex: 1,
            maxWidth: '468px',
            margin: '0 auto',
            my: 24,
          }}
        >
          <Typography variant="h6" sx={(theme) => ({ color: theme.palette.text.primary })}>
            <Trans>Nothing found</Trans>
          </Typography>
          <Typography sx={{ mt: 1, mb: 4 }} variant="description" color="text.secondary">
            <Trans>
              We couldn&apos;t find any transactions related to your search. Try again with a
              different asset name, or reset filters.
            </Trans>
          </Typography>
          <Button
            variant="outlined"
            onClick={() => {
              setSearchQuery('');
              setFilterQuery([]);
              setSearchResetKey((prevKey) => prevKey + 1); // Remount SearchInput component to clear search query
            }}
          >
            Reset Filters
          </Button>
        </Box>
      ) : !isFetchingNextPage ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            flex: 1,
          }}
        >
          <Typography variant="h6" sx={(theme) => ({ color: theme.palette.text.primary, my: 24 })}>
            <Trans>No Transaction yet.</Trans>
          </Typography>
        </Box>
      ) : (
        <></>
      )}

      <Box
        sx={{ display: 'flex', justifyContent: 'center', mb: isFetchingNextPage ? 6 : 0, mt: 10 }}
      >
        {isFetchingNextPage && (
          <Box
            sx={{
              height: 36,
              width: 186,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CircularProgress size={20} style={{ color: '#383D51' }} />
          </Box>
        )}
      </Box>
    </ListWrapper>
  );
};

export default HistoryWrapper;
