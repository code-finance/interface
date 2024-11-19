import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { Box, Skeleton, SvgIcon, useMediaQuery, useTheme } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { CircleIcon } from 'src/components/CircleIcon';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import {
  defaultRateUSDNotValue,
  SCAN_PRICE_TON,
} from 'src/hooks/app-data-provider/useAppDataProviderTon';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';
import {
  ComputedReserveData,
  useAppDataContext,
} from '../../hooks/app-data-provider/useAppDataProvider';

interface ReserveTopDetailsProps {
  underlyingAsset: string;
}

export const ReserveTopDetails = ({ underlyingAsset }: ReserveTopDetailsProps) => {
  const { reserves, loading, isConnectNetWorkTon } = useAppDataContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const theme = useTheme();
  const downToSM = useMediaQuery(theme.breakpoints.down('xsm'));

  const poolReserve = reserves.find(
    (reserve) => reserve.underlyingAsset === underlyingAsset
  ) as ComputedReserveData;

  const getViewOracleContractTon = (address: string | undefined) => {
    return _.find(defaultRateUSDNotValue, { address })?.id || null;
  };
  const valueTypographyVariant = downToSM ? 'body6' : 'body1';
  const symbolsTypographyVariant = downToSM ? 'body6' : 'body1';

  const linkViewOracleContract = isConnectNetWorkTon
    ? `${SCAN_PRICE_TON}/en/coins/${getViewOracleContractTon(poolReserve.underlyingAssetTon)}`
    : currentNetworkConfig.explorerLinkBuilder({
        address: poolReserve?.priceOracle,
      });

  return (
    <>
      <TopInfoPanelItem title={<Trans>Reserve Size</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.totalLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Available liquidity</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={Math.max(Number(poolReserve?.availableLiquidityUSD), 0)}
          symbol="USD"
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Utilization Rate</Trans>} loading={loading} hideIcon>
        <FormattedNumber
          value={poolReserve?.borrowUsageRatio}
          percent
          variant={valueTypographyVariant}
          symbolsVariant={symbolsTypographyVariant}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem title={<Trans>Oracle price</Trans>} loading={loading} hideIcon>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <FormattedNumber
            value={poolReserve?.priceInUSD}
            symbol="USD"
            variant={valueTypographyVariant}
            symbolsVariant={symbolsTypographyVariant}
          />
          {loading ? (
            <Skeleton width={16} height={16} sx={{ ml: 1 }} />
          ) : (
            <CircleIcon tooltipText="View oracle contract" downToSM={downToSM}>
              <Link
                onClick={() =>
                  trackEvent(GENERAL.EXTERNAL_LINK, {
                    Link: 'Oracle Price',
                    oracle: poolReserve?.priceOracle,
                    assetName: poolReserve.name,
                    asset: poolReserve.underlyingAsset,
                  })
                }
                href={linkViewOracleContract}
                sx={(theme) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: theme.palette.text.primary,
                  cursor: 'pointer',
                })}
              >
                <SvgIcon sx={{ fontSize: '14px' }}>
                  <CallMadeOutlinedIcon />
                </SvgIcon>
              </Link>
            </CircleIcon>
          )}
        </Box>
      </TopInfoPanelItem>
    </>
  );
};
