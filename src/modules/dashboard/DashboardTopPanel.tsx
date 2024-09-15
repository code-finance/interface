import { ChainId } from '@aave/contract-helpers';
import { normalize, UserIncentiveData, valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import { NetAPYTooltip } from 'src/components/infoTooltips/NetAPYTooltip';
import { getMarketInfoById } from 'src/components/MarketSwitcher';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { ROUTES } from 'src/components/primitives/Link';
import { PageTitle } from 'src/components/TopInfoPanel/PageTitle';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { selectIsMigrationAvailable } from 'src/store/v3MigrationSelectors';
import { AUTH, DASHBOARD, GENERAL } from 'src/utils/mixPanelEvents';

import { HealthFactorNumber } from '../../components/HealthFactorNumber';
import { NoData } from '../../components/primitives/NoData';
import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import { useAppDataContext } from '../../hooks/app-data-provider/useAppDataProvider';
import { LiquidationRiskParametresInfoModal } from './LiquidationRiskParametresModal/LiquidationRiskParametresModal';

export const DashboardTopPanel = () => {
  const { currentNetworkConfig, currentMarketData, currentMarket } = useProtocolDataContext();

  const { market } = getMarketInfoById(currentMarket);
  const { user, reserves, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const [open, setOpen] = useState(false);
  const { openClaimRewards } = useModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);
  const isMigrateToV3Available = useRootStore((state) => selectIsMigrationAvailable(state));
  const showMigrateButton = user
    ? isMigrateToV3Available && currentAccount !== '' && Number(user.totalLiquidityUSD) > 0
    : false;
  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const router = useRouter();

  const { claimableRewardsUsd } = user
    ? Object.keys(user.calculatedUserIncentives).reduce(
        (acc, rewardTokenAddress) => {
          const incentive: UserIncentiveData = user.calculatedUserIncentives[rewardTokenAddress];
          const rewardBalance = normalize(
            incentive.claimableRewards,
            incentive.rewardTokenDecimals
          );

          let tokenPrice = 0;
          // getting price from reserves for the native rewards for v2 markets
          if (!currentMarketData.v3 && Number(rewardBalance) > 0) {
            if (currentMarketData.chainId === ChainId.mainnet) {
              const aave = reserves.find((reserve) => reserve.symbol === 'AAVE');
              tokenPrice = aave ? Number(aave.priceInUSD) : 0;
            } else {
              reserves.forEach((reserve) => {
                if (reserve.symbol === currentNetworkConfig.wrappedBaseAssetSymbol) {
                  tokenPrice = Number(reserve.priceInUSD);
                }
              });
            }
          } else {
            tokenPrice = Number(incentive.rewardPriceFeed);
          }

          const rewardBalanceUsd = Number(rewardBalance) * tokenPrice;

          if (rewardBalanceUsd > 0) {
            if (acc.assets.indexOf(incentive.rewardTokenSymbol) === -1) {
              acc.assets.push(incentive.rewardTokenSymbol);
            }

            acc.claimableRewardsUsd += Number(rewardBalanceUsd);
          }

          return acc;
        },
        { claimableRewardsUsd: 0, assets: [] } as { claimableRewardsUsd: number; assets: string[] }
      )
    : { claimableRewardsUsd: 0 };

  const loanToValue =
    user?.totalCollateralMarketReferenceCurrency === '0'
      ? '0'
      : valueToBigNumber(user?.totalBorrowsMarketReferenceCurrency || '0')
          .dividedBy(user?.totalCollateralMarketReferenceCurrency || '1')
          .toFixed();

  const valueTypographyVariant = downToSM ? 'body6' : 'body1';
  const noDataTypographyVariant = downToSM ? 'body6' : 'body1';

  return (
    <>
      <TopInfoPanel pageTitle={<Trans>Dashboard</Trans>} withMarketSwitcher>
        <TopInfoPanelItem hideIcon title={<Trans>Net worth</Trans>} loading={loading}>
          {currentAccount ? (
            <FormattedNumber
              value={Number(user?.netWorthUSD || 0)}
              symbol="USD"
              variant={valueTypographyVariant}
              visibleDecimals={2}
              compact
              symbolsVariant={noDataTypographyVariant}
            />
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
        <TopInfoPanelItem
          title={
            <span style={{ display: 'flex' }}>
              <Trans>Net APY</Trans>
              <NetAPYTooltip
                iconSize={18}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: { tooltip: 'NET APY: Dashboard Banner' },
                }}
              />
            </span>
          }
          loading={loading}
          hideIcon
        >
          {currentAccount && user && Number(user.netWorthUSD) > 0 ? (
            <FormattedNumber
              value={user ? user.netAPY : 0}
              variant={valueTypographyVariant}
              visibleDecimals={2}
              percent
              symbolsColor={theme.palette.text.primary}
              symbolsVariant={noDataTypographyVariant}
            />
          ) : (
            <NoData variant={noDataTypographyVariant} sx={{ opacity: '0.7' }} />
          )}
        </TopInfoPanelItem>
        {currentAccount && user?.healthFactor !== '-1' && (
          <TopInfoPanelItem
            title={<Trans>Health factor</Trans>}
            loading={loading}
            hideIcon
            sx={{ minWidth: { xs: '115px', xsm: '170px' } }}
          >
            <HealthFactorNumber
              isHeader
              value={user?.healthFactor || '-1'}
              variant={valueTypographyVariant}
              onInfoClick={() => {
                trackEvent(DASHBOARD.VIEW_RISK_DETAILS);
                setOpen(true);
              }}
            />
          </TopInfoPanelItem>
        )}
        {currentAccount && claimableRewardsUsd > 0 && (
          <TopInfoPanelItem
            sx={{ minWidth: { xs: '115px', xsm: '170px' } }}
            title={<Trans>Available rewards</Trans>}
            loading={loading}
            hideIcon
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', xsm: 'center' },
                flexDirection: { xs: 'column', xsm: 'row' },
              }}
            >
              <Box sx={{ display: 'inline-flex', alignItems: 'center' }} data-cy={'Claim_Box'}>
                <FormattedNumber
                  value={claimableRewardsUsd}
                  variant={valueTypographyVariant}
                  visibleDecimals={2}
                  compact
                  symbol="USD"
                  symbolsVariant={noDataTypographyVariant}
                  data-cy={'Claim_Value'}
                />
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => openClaimRewards()}
                sx={{ minWidth: 'unset', ml: { xs: 0, xsm: 2 } }}
                data-cy={'Dashboard_Claim_Button'}
              >
                <Trans>Claim</Trans>
              </Button>
            </Box>
          </TopInfoPanelItem>
        )}
        {currentAccount && (
          <>
            {md ? (
              <Button
                sx={{
                  ml: 'auto',
                  mt: { xsm: 0 },
                  width: '221px',
                  height: '42px',
                  px: 2,
                  py: '3px',
                  border: `1px solid ${theme.palette.border.contents}`,
                  ...theme.typography.detail2,
                  color: theme.palette.text.secondary,
                  borderRadius: 1,
                  alignSelf: 'center',
                }}
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                size="small"
                variant="transparent"
              >
                <Typography variant="body4">
                  <Trans>View Transactions</Trans>
                </Typography>
              </Button>
            ) : (
              <Button
                sx={{
                  ml: 'auto',
                  alignSelf: 'flex-end',
                }}
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                size="small"
                variant="transparent-link"
              >
                <Trans>View Transactions</Trans>
              </Button>
            )}{' '}
          </>
        )}
      </TopInfoPanel>

      <LiquidationRiskParametresInfoModal
        open={open}
        setOpen={setOpen}
        healthFactor={user?.healthFactor || '-1'}
        loanToValue={loanToValue}
        currentLoanToValue={user?.currentLoanToValue || '0'}
        currentLiquidationThreshold={user?.currentLiquidationThreshold || '0'}
      />
    </>
  );
};
