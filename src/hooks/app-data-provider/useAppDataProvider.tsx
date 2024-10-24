import {
  FormattedGhoReserveData,
  FormattedGhoUserData,
  formatUserSummaryWithDiscount,
  USD_DECIMALS,
  UserReserveData,
} from '@aave/math-utils';
import { formatUnits } from 'ethers/lib/utils';
import React, { useContext } from 'react';
import { EmodeCategory } from 'src/helpers/types';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { GHO_MINTING_MARKETS } from 'src/utils/ghoUtilities';

import { formatEmodes } from '../../store/poolSelectors';
import {
  ExtendedFormattedUser as _ExtendedFormattedUser,
  useExtendedUserSummaryAndIncentives,
} from '../pool/useExtendedUserSummaryAndIncentives';
import { useGhoPoolFormattedReserve } from '../pool/useGhoPoolFormattedReserve';
import {
  FormattedReservesAndIncentives,
  usePoolFormattedReserves,
} from '../pool/usePoolFormattedReserves';
import { usePoolReservesHumanized } from '../pool/usePoolReserves';
import { useUserGhoPoolFormattedReserve } from '../pool/useUserGhoPoolFormattedReserve';
import { useUserPoolReservesHumanized } from '../pool/useUserPoolReserves';
import { FormattedUserReserves } from '../pool/useUserSummaryAndIncentives';
import { useUserSummaryAndIncentivesTon } from '../pool/useUserSummaryAndIncentivesTon';
import { useTonYourSupplies } from '../useTonYourSupplies';
import { useAppDataProviderTon } from './useAppDataProviderTon';
import { useSocketGetRateUSD } from './useSocketGetRateUSD';
import { WalletBalancesMap } from './useWalletBalances';
import { useWalletBalancesTon } from './useWalletBalancesTon';
/**
 * removes the marketPrefix from a symbol
 * @param symbol
 * @param prefix
 */
export const unPrefixSymbol = (symbol: string, prefix: string) => {
  return symbol.toUpperCase().replace(RegExp(`^(${prefix[0]}?${prefix.slice(1)})`), '');
};

/**
 * @deprecated Use FormattedReservesAndIncentives type from usePoolFormattedReserves hook
 */
export type ComputedReserveData = FormattedReservesAndIncentives;

/**
 * @deprecated Use FormattedUserReserves type from useUserSummaryAndIncentives hook
 */
export type ComputedUserReserveData = FormattedUserReserves;

/**
 * @deprecated Use ExtendedFormattedUser type from useExtendedUserSummaryAndIncentives hook
 */
export type ExtendedFormattedUser = _ExtendedFormattedUser;

export interface AppDataContextType {
  loading: boolean;
  reserves: ComputedReserveData[];
  reservesTon: DashboardReserve[];
  eModes: Record<number, EmodeCategory>;
  user?: ExtendedFormattedUser;
  marketReferencePriceInUsd: string;
  marketReferenceCurrencyDecimals: number;
  userReserves: UserReserveData[];
  ghoReserveData: FormattedGhoReserveData;
  ghoUserData: FormattedGhoUserData;
  ghoLoadingData: boolean;
  ghoUserLoadingData: boolean;
  walletBalancesTon: WalletBalancesMap;
  getYourSupplies: () => void;
  getPoolContractGetReservesData: (iSPauseReload?: boolean) => void;
  gasFeeTonMarketReferenceCurrencyTON: string | number;
  balanceTokenTONMarket: string | number;
  isTonNetwork: boolean;
  isConnectNetWorkTon: boolean;
}

const AppDataContext = React.createContext<AppDataContextType>({} as AppDataContextType);

/**
 * This is the only provider you'll ever need.
 * It fetches reserves /incentives & walletbalances & keeps them updated.
 */
export const AppDataProvider: React.FC = ({ children }) => {
  const { currentAccount } = useWeb3Context();
  const { isConnectedTonWallet, walletAddressTonWallet } = useTonConnectContext();
  const currentMarketData = useRootStore((state) => state.currentMarketData);
  const currentMarket = useRootStore((state) => state.currentMarket);

  const { ExchangeRateListUSD, loading: loadingMarketPrice } = useSocketGetRateUSD();

  const {
    reservesTon,
    loading: loadingReservesTon,
    getPoolContractGetReservesData,
    gasFeeTonMarketReferenceCurrencyTON,
    balanceTokenTONMarket,
  } = useAppDataProviderTon(ExchangeRateListUSD);

  const { walletBalancesTon } = useWalletBalancesTon(reservesTon);
  const {
    loading: loadingUseTonYourSuppliesTon,
    yourSuppliesTon,
    contractUserTon,
    getYourSupplies,
  } = useTonYourSupplies(walletAddressTonWallet, reservesTon);

  const { userSummaryTon, loading: userSummaryLoadingTon } = useUserSummaryAndIncentivesTon(
    yourSuppliesTon,
    contractUserTon
  );

  // pool hooks

  const { data: reservesData, isLoading: reservesDataLoading } =
    usePoolReservesHumanized(currentMarketData);
  const { data: formattedPoolReserves, isLoading: formattedPoolReservesLoading } =
    usePoolFormattedReserves(currentMarketData);
  const baseCurrencyData = reservesData?.baseCurrencyData;
  // user hooks

  const eModes = reservesData?.reservesData ? formatEmodes(reservesData.reservesData) : {};

  const { data: userReservesData, isLoading: userReservesDataLoading } =
    useUserPoolReservesHumanized(currentMarketData);
  const { data: userSummary, isLoading: userSummaryLoading } =
    useExtendedUserSummaryAndIncentives(currentMarketData);
  const userReserves = userReservesData?.userReserves;

  // gho hooks
  const { data: formattedGhoUserData, isLoading: isGhoUserDataLoading } =
    useUserGhoPoolFormattedReserve(currentMarketData);
  const { data: formattedGhoReserveData, isLoading: ghoReserveDataLoading } =
    useGhoPoolFormattedReserve(currentMarketData);

  const formattedGhoReserveDataWithDefault = formattedGhoReserveData || {
    aaveFacilitatorRemainingCapacity: 0,
    aaveFacilitatorMintedPercent: 0,
    aaveFacilitatorBucketLevel: 0,
    aaveFacilitatorBucketMaxCapacity: 0,
    ghoBorrowAPYWithMaxDiscount: 0,
    ghoBaseVariableBorrowRate: 0,
    ghoVariableBorrowAPY: 0,
    ghoDiscountedPerToken: 0,
    ghoDiscountRate: 0,
    ghoMinDebtTokenBalanceForDiscount: 0,
    ghoMinDiscountTokenBalanceForDiscount: 0,
  };

  const formattedGhoUserDataWithDefault = formattedGhoUserData || {
    userGhoDiscountPercent: 0,
    userDiscountTokenBalance: 0,
    userGhoBorrowBalance: 0,
    userDiscountedGhoInterest: 0,
    userGhoAvailableToBorrowAtDiscount: 0,
  };

  const isTonNetwork = currentMarketData.marketTitle === 'TON';
  const isConnectNetWorkTon = isConnectedTonWallet && isTonNetwork;

  // loading
  const isReservesLoading = isTonNetwork
    ? loadingReservesTon || loadingMarketPrice
    : reservesDataLoading || formattedPoolReservesLoading;

  const isUserDataLoading = isTonNetwork
    ? userSummaryLoadingTon || loadingUseTonYourSuppliesTon
    : userReservesDataLoading || userSummaryLoading;

  let user = isConnectNetWorkTon ? userSummaryTon : userSummary;
  // Factor discounted GHO interest into cumulative user fields

  const isGhoInMarket = GHO_MINTING_MARKETS.includes(currentMarket);

  if (isGhoInMarket && reservesData && formattedGhoUserData) {
    const baseCurrencyData = reservesData.baseCurrencyData;
    if (formattedGhoUserData.userDiscountedGhoInterest > 0 && user) {
      const userSummaryWithDiscount = formatUserSummaryWithDiscount({
        userGhoDiscountedInterest: formattedGhoUserData.userDiscountedGhoInterest,
        user,
        marketReferenceCurrencyPriceUSD: Number(
          formatUnits(baseCurrencyData.marketReferenceCurrencyPriceInUsd, USD_DECIMALS)
        ),
      });
      user = {
        ...user,
        ...userSummaryWithDiscount,
      };
    }
  }

  const reserves = isTonNetwork ? reservesTon : formattedPoolReserves || [];

  const marketReferencePriceInUsd = isConnectNetWorkTon
    ? `${10 ** 8}`
    : baseCurrencyData?.marketReferenceCurrencyPriceInUsd || '0';

  const marketReferenceCurrencyDecimals = isConnectNetWorkTon
    ? 8
    : baseCurrencyData?.marketReferenceCurrencyDecimals || 0;

  return (
    <AppDataContext.Provider
      value={{
        loading: isReservesLoading || (!!currentAccount && isUserDataLoading),
        reserves: reserves,
        reservesTon,
        eModes,
        user: user,
        userReserves: userReserves || [],
        marketReferencePriceInUsd,
        marketReferenceCurrencyDecimals,
        // TODO: we should consider removing this from the context and use zustand instead. If we had a selector that would return the formatted gho data, I think that
        // would work out pretty well. We could even extend that pattern for the other reserves, and migrate towards the global store instead of the app data provider.
        // ghoLoadingData for now is just propagated through to reduce changes to other components.
        ghoReserveData: formattedGhoReserveDataWithDefault,
        ghoUserData: formattedGhoUserDataWithDefault,
        ghoLoadingData: ghoReserveDataLoading,
        ghoUserLoadingData: !!currentAccount && isGhoUserDataLoading,
        walletBalancesTon,
        getPoolContractGetReservesData,
        getYourSupplies,
        gasFeeTonMarketReferenceCurrencyTON,
        balanceTokenTONMarket,
        isTonNetwork,
        isConnectNetWorkTon,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppDataContext = () => useContext(AppDataContext);
