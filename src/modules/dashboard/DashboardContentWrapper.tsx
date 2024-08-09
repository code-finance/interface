import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/components/primitives/Link';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

import { BorrowAssetsList } from './lists/BorrowAssetsList/BorrowAssetsList';
import { BorrowedPositionsList } from './lists/BorrowedPositionsList/BorrowedPositionsList';
import { SuppliedPositionsList } from './lists/SuppliedPositionsList/SuppliedPositionsList';
import { SupplyAssetsList } from './lists/SupplyAssetsList/SupplyAssetsList';

interface DashboardContentWrapperProps {
  isBorrow: boolean;
}

export const DashboardContentWrapper = ({ isBorrow }: DashboardContentWrapperProps) => {
  const { breakpoints } = useTheme();
  const { currentAccount } = useWeb3Context();
  const router = useRouter();
  const trackEvent = useRootStore((store) => store.trackEvent);
  const theme = useTheme();
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));
  const paperWidth = isDesktop ? 'calc(50% - 8px)' : '100%';

  const downToLg = useMediaQuery(breakpoints.down('lg'));

  return (
    <Box>
      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: { xs: isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && !isBorrow && downToLg && (
            <Box>
              <Button
                sx={{
                  position: 'absolute',
                  top: '-120px',
                  right: '0px',
                }}
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="surface"
                size="small"
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}

          <SuppliedPositionsList />
          <SupplyAssetsList />
        </Box>

        <Box
          sx={{
            position: 'relative',

            display: { xs: !isBorrow ? 'none' : 'block', lg: 'block' },
            width: paperWidth,
          }}
        >
          {currentAccount && (
            <Box
              sx={{
                position: 'absolute',
                top: '-153px',
                right: '0px',
              }}
            >
              <Button
                onClick={() => {
                  router.push(ROUTES.history);
                  trackEvent(AUTH.VIEW_TX_HISTORY);
                }}
                component="a"
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  bgcolor: 'transparent',
                  height: '42px',
                  p: '10px 24px',
                  fontSize: '17px',
                  borderColor: theme.palette.text.subText,
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <Trans>View Transactions</Trans>
              </Button>
            </Box>
          )}

          <BorrowedPositionsList />
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
