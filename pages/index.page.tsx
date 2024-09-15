import { Trans } from '@lingui/macro';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import StyledToggleButton from 'src/components/StyledToggleButton';
import StyledToggleButtonGroup from 'src/components/StyledToggleButtonGroup';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useRootStore } from 'src/store/root';

import { ConnectWalletPaper } from '../src/components/ConnectWalletPaper';
import { ContentContainer } from '../src/components/ContentContainer';
import { MainLayout } from '../src/layouts/MainLayout';
import { useWeb3Context } from '../src/libs/hooks/useWeb3Context';
import { DashboardContentWrapper } from '../src/modules/dashboard/DashboardContentWrapper';
import { DashboardTopPanel } from '../src/modules/dashboard/DashboardTopPanel';

export default function Home() {
  const { currentAccount, loading: web3Loading } = useWeb3Context();
  const { currentMarket } = useProtocolDataContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const [mode, setMode] = useState<'supply' | 'borrow' | ''>('supply');
  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Dashboard',
      Market: currentMarket,
    });
  }, [trackEvent]);

  return (
    <>
      <DashboardTopPanel />

      <ContentContainer>
        {currentAccount && (
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              justifyContent: { xs: 'center', xsm: 'flex-start' },
              mb: 4,
            }}
          >
            <StyledToggleButtonGroup
              sx={{ width: { xs: '100%', sm: 'unset' } }}
              color="primary"
              value={mode}
              exclusive
              onChange={(_, value) => {
                if (!value) return;
                setMode(value);
              }}
            >
              <StyledToggleButton value="supply">
                <Trans>Supply</Trans>
              </StyledToggleButton>
              <StyledToggleButton value="borrow">
                <Trans>Borrow</Trans>
              </StyledToggleButton>
            </StyledToggleButtonGroup>
          </Box>
        )}

        {currentAccount ? (
          <DashboardContentWrapper isBorrow={mode === 'borrow'} />
        ) : (
          <ConnectWalletPaper loading={web3Loading} />
        )}
      </ContentContainer>
    </>
  );
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
