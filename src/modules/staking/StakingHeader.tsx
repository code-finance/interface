import { Trans } from '@lingui/macro';
import { Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
// eslint-disable-next-line import/namespace
import { ChainAvailabilityText } from 'src/components/ChainAvailabilityText';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { Link } from '../../components/primitives/Link';
import { TopInfoPanelItem } from '../../components/TopInfoPanel/TopInfoPanelItem';

interface StakingHeaderProps {
  tvl: {
    [key: string]: number;
  };
  stkEmission: string;
  loading: boolean;
}

export const StakingHeader: React.FC<StakingHeaderProps> = ({ tvl, stkEmission, loading }) => {
  const theme = useTheme();
  const upToLG = useMediaQuery(theme.breakpoints.up('lg'));
  const downToSM = useMediaQuery(theme.breakpoints.down('sm'));
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));

  // const valueTypographyVariant = downToSM ? 'main16' : 'main21';
  const symbolsTypographyVariant = downToSM ? 'secondary16' : 'secondary21';
  const trackEvent = useRootStore((store) => store.trackEvent);

  const total = Object.values(tvl || {}).reduce((acc, item) => acc + item, 0);

  const TotalFundsTooltip = () => {
    return (
      <TextWithTooltip iconSize={24} color={'text.secondary'}>
        <Box>
          {Object.entries(tvl)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value]) => (
              <Row key={key} caption={key} captionVariant="caption">
                <FormattedNumber value={value} symbol="USD" visibleDecimals={2} variant="caption" />
              </Row>
            ))}
        </Box>
      </TextWithTooltip>
    );
  };

  return (
    <TopInfoPanel
      titleComponent={
        <Box mb={'40px'}>
          <ChainAvailabilityText wrapperSx={{ mb: 3 }} title="Staking" />

          <Typography variant="body3" sx={{ color: 'text.secondary', maxWidth: '1260px', mb: 10 }}>
            <Trans>
              CODE holders (Ethereum, Kaia network only) can stake their assets in the Safety Module
              to add more security to the protocol and earn Safety Incentives. In the case of a
              shortfall event, your stake can be slashed to cover the deficit, providing an
              additional layer of protection for the protocol. Learn more about risks involved
            </Trans>{' '}
            <Link
              href="https://docs.aave.com/faq/migration-and-staking"
              sx={{ textDecoration: 'underline', color: 'text.secondary' }}
              onClick={() =>
                trackEvent(GENERAL.EXTERNAL_LINK, {
                  Link: 'Staking Risks',
                })
              }
            >
              <Trans>Learn more about risks involved</Trans>
            </Link>
          </Typography>
        </Box>
      }
      wrapperSx={{ pb: '54px' }}
    >
      <TopInfoPanelItem
        hideIcon
        title={
          <Stack direction="row" alignItems="center">
            <Typography variant="body3" color={'text.secondary'}>
              <Trans>Funds in the Safety Module</Trans>
            </Typography>
            <TotalFundsTooltip />
          </Stack>
        }
        loading={loading}
      >
        <FormattedNumber
          value={total}
          symbol="USD"
          variant={'body1'}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="text.primary"
          visibleDecimals={2}
        />
      </TopInfoPanelItem>

      <TopInfoPanelItem
        hideIcon
        title={
          <Typography variant="body3" color={'text.secondary'}>
            <Trans>Total emission per day</Trans>
          </Typography>
        }
        loading={loading}
      >
        <FormattedNumber
          value={stkEmission || 0}
          symbol="USD"
          variant={'body1'}
          symbolsVariant={symbolsTypographyVariant}
          symbolsColor="text.primary"
          visibleDecimals={2}
        />
      </TopInfoPanelItem>
    </TopInfoPanel>
  );
};
