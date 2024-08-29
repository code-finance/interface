import {
  InformationCircleIcon,
  SparklesIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Badge,
  Button,
  NoSsr,
  Slide,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContentWithTooltip } from 'src/components/ContentWithTooltip';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { ENABLE_TESTNET, FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';

import { Link } from '../components/primitives/Link';
import { useProtocolDataContext } from '../hooks/useProtocolDataContext';
import { uiConfig } from '../uiConfig';
import { NavItems } from './components/NavItems';
import { MobileMenu } from './MobileMenu';
import { SettingsMenu } from './SettingsMenu';
import WalletWidget from './WalletWidget';

interface Props {
  children: React.ReactElement;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: '2px',
    right: '2px',
    borderRadius: '20px',
    width: '10px',
    height: '10px',
    backgroundColor: theme.palette.mode === 'light' ? '#e6e4f4' : '#28216d',
    color: `${theme.palette.secondary.main}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

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

export function AppHeader() {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const sm = useMediaQuery(breakpoints.up('sm'));
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

  const { openSwitch, openBridge } = useModalContext();

  const { currentMarketData } = useProtocolDataContext();
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

  const headerHeight = lg ? 54 : 68;

  const toggleWalletWigit = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setWalletWidgetOpen(state);
  };

  const toggleMobileMenu = (state: boolean) => {
    if (md) setMobileDrawerOpen(state);
    setMobileMenuOpen(state);
  };

  const disableTestnet = () => {
    localStorage.setItem('testnetsEnabled', 'false');
    // Set window.location to trigger a page reload when navigating to the the dashboard
    window.location.href = '/';
  };

  const disableFork = () => {
    localStorage.setItem('testnetsEnabled', 'false');
    localStorage.removeItem('forkEnabled');
    localStorage.removeItem('forkBaseChainId');
    localStorage.removeItem('forkNetworkId');
    localStorage.removeItem('forkRPCUrl');
    // Set window.location to trigger a page reload when navigating to the the dashboard
    window.location.href = '/';
  };
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
          backgroundColor: theme.palette.mode === 'light' ? '#e6e4f4' : '#28216d',
          padding: {
            xs: '5px 12px 5px 20px',
            xsm: '20px 40px 0',
          },
          display: 'flex',
          alignItems: 'center',
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
          <img
            style={{
              color: theme.palette.text.primary,
              height: '30px',
              width: 'auto',
            }}
            sizes="small"
            src={sm ? uiConfig.appLogo : uiConfig.appLogoMobile}
            alt="CODE labs"
          />
        </Box>

        <Box sx={{ display: { xs: 'none', lg: 'block', flex: 1 } }}>
          <NavItems />
        </Box>

        {!mobileMenuOpen && (
          <Box
            sx={{
              bgcolor: theme.palette.background.modulePopup,
              borderRadius: 3,
              height: lg ? '48px' : '44px',
              ml: 'auto',
              overflow: 'hidden',
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
