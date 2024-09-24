import { Slide, useMediaQuery, useScrollTrigger, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';

import LogoLarge from '/public/codelabs-logo-large.svg';
import LogoSmall from '/public/codelabs-logo-small.svg';

import { Link } from '../components/primitives/Link';
import { useProtocolDataContext } from '../hooks/useProtocolDataContext';
import { NavItems } from './components/NavItems';
import { MobileMenu } from './MobileMenu';
import { SettingsMenu } from './SettingsMenu';
import WalletWidget from './WalletWidget';

interface Props {
  children: React.ReactElement;
}

function HideOnScroll({ children }: Props) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const trigger = useScrollTrigger({ threshold: md ? 160 : 80 });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const SWITCH_VISITED_KEY = 'switchVisited';

export function AppHeader({ isGovernanceDetails }: { isGovernanceDetails?: boolean }) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const lgDown = useMediaQuery(breakpoints.down('lg'));
  const lg = useMediaQuery(breakpoints.up('lg'));
  const theme = useTheme();

  const [visitedSwitch, setVisitedSwitch] = useState(() => {
    if (typeof window === 'undefined') return true;
    return Boolean(localStorage.getItem(SWITCH_VISITED_KEY));
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useRootStore((state) => [
    state.mobileDrawerOpen,
    state.setMobileDrawerOpen,
  ]);

  // const { openSwitch, openBridge } = useModalContext();

  // const { currentMarketData } = useProtocolDataContext();
  const [walletWidgetOpen, setWalletWidgetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileDrawerOpen && !md) {
      setMobileDrawerOpen(false);
    }
    if (walletWidgetOpen) {
      setWalletWidgetOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [md]);

  const headerHeight = lg ? 88 : 50;

  const toggleWalletWigit = (state: boolean) => {
    if (lgDown) setMobileDrawerOpen(state);
    setWalletWidgetOpen(state);
  };
  const toggleMobileMenu = (state: boolean) => {
    if (lgDown) setMobileDrawerOpen(state);
    setMobileMenuOpen(state);
  };

  // const disableTestnet = () => {
  //   localStorage.setItem('testnetsEnabled', 'false');
  //   // Set window.location to trigger a page reload when navigating to the the dashboard
  //   window.location.href = '/';
  // };

  // const disableFork = () => {
  //   localStorage.setItem('testnetsEnabled', 'false');
  //   localStorage.removeItem('forkEnabled');
  //   localStorage.removeItem('forkBaseChainId');
  //   localStorage.removeItem('forkNetworkId');
  //   localStorage.removeItem('forkRPCUrl');
  //   // Set window.location to trigger a page reload when navigating to the the dashboard
  //   window.location.href = '/';
  // };
  return (
    <HideOnScroll>
      <Box
        component="header"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        sx={(theme) => ({
          position: 'sticky',
          top: 0,
          transition: theme.transitions.create('top'),
          zIndex: theme.zIndex.appBar,
          backgroundColor: isGovernanceDetails
            ? theme.palette.background.primary
            : theme.palette.mode === 'light'
            ? '#e6e4f4'
            : '#28216d',
          padding: {
            xs: '5px 12px 5px 20px',
            lg: '20px 40px',
          },
          display: 'flex',
          alignItems: 'center',
          '& #wallet-button': isGovernanceDetails
            ? {
                backgroundColor: theme.palette.background.secondary,
                '&:hover': {
                  backgroundColor: theme.palette.background.tertiary,
                },
              }
            : {},
        })}
      >
        <Box
          component={Link}
          href="/"
          aria-label="Go to homepage"
          sx={{
            lineHeight: 0,
            mr: 2,
            transition: '0.3s ease all',
            '&:hover': { opacity: 0.7 },
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          {lg ? (
            <LogoLarge
              style={{
                color: theme.palette.text.primary,
                height: '30px',
                width: 'auto',
              }}
            />
          ) : (
            <LogoSmall
              style={{
                color: theme.palette.text.primary,
                height: '30px',
                width: 'auto',
              }}
            />
          )}
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block', flex: 1 } }}>
          <NavItems />
        </Box>

        {!mobileMenuOpen && (
          <Box
            sx={{
              ml: 'auto',
            }}
          >
            <WalletWidget
              open={walletWidgetOpen}
              setOpen={toggleWalletWigit}
              headerHeight={headerHeight}
            />
          </Box>
        )}

        <Box
          sx={{
            display: { xs: 'none', lg: 'block' },
          }}
        >
          <SettingsMenu />
        </Box>

        {!walletWidgetOpen && (
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, ml: mobileMenuOpen ? 'auto' : 'unset' }}>
            <MobileMenu
              open={mobileMenuOpen}
              setOpen={toggleMobileMenu}
              headerHeight={headerHeight}
            />
          </Box>
        )}
      </Box>
    </HideOnScroll>
  );
}
