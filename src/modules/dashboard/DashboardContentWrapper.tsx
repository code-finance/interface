import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { MULTIPLE_MARKET_OPTIONS } from 'src/components/MarketSwitcher';
import { ROUTES } from 'src/components/primitives/Link';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { StyledTxModalToggleButton } from 'src/components/StyledToggleButton';
import { StyledTxModalToggleGroup } from 'src/components/StyledToggleButtonGroup';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { CustomMarket } from 'src/utils/marketsAndNetworksConfig';
import { AUTH, DASHBOARD } from 'src/utils/mixPanelEvents';

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
  const [currentMarket, setCurrentMarket] = useRootStore((store) => [
    store.currentMarket,
    store.setCurrentMarket,
  ]);
  const currentNetworkConfig = useRootStore((store) => store.currentNetworkConfig);

  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const isDesktop = useMediaQuery(breakpoints.up('lg'));

  return (
    <Box>
      {currentMarketData.chainId === ChainId.polygon && !currentMarketData.v3}
      <Box
        sx={{
          display: isDesktop ? 'flex' : 'block',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 5,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: { xs: isBorrow ? 'none' : 'block', lg: 'block' },
            flex: 1,
          }}
        >
          <SuppliedPositionsList />
          <SupplyAssetsList />
        </Box>

        <Box
          sx={{
            position: 'relative',
            display: { xs: !isBorrow ? 'none' : 'block', lg: 'block' },
            flex: 1,
          }}
        >
          <BorrowedPositionsList />
          <BorrowAssetsList />
        </Box>
      </Box>
    </Box>
  );
};
