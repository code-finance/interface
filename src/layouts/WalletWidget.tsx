import { DuplicateIcon } from '@heroicons/react/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Skeleton,
  SvgIcon,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';
import React, { useState } from 'react';
import { AvatarSize } from 'src/components/Avatar';
import { CompactMode } from 'src/components/CompactableTypography';
import { Warning } from 'src/components/primitives/Warning';
import { UserDisplay } from 'src/components/UserDisplay';
import { WalletModal } from 'src/components/WalletConnection/WalletModal';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { AUTH, GENERAL } from 'src/utils/mixPanelEvents';

import { Link } from '../components/primitives/Link';
import { ENABLE_TESTNET, getNetworkConfig, STAGING_ENV } from '../utils/marketsAndNetworksConfig';
import { DrawerWrapper } from './components/DrawerWrapper';
import { MobileCloseButton } from './components/MobileCloseButton';

interface WalletWidgetProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

const useStyles = makeStyles((theme: Theme) => ({
  menuPaper: {
    backgroundColor: theme.palette.background.primary,
    boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)',
    padding: '20px 12px',
    borderRadius: '12px',
    width: '300px',
  },
}));
export default function WalletWidget({ open, setOpen, headerHeight }: WalletWidgetProps) {
  const { disconnectWallet, currentAccount, connected, chainId, loading, readOnlyModeAddress } =
    useWeb3Context();
  const classes = useStyles();
  const { setWalletModalOpen } = useWalletModalContext();
  const theme = useTheme();
  const { breakpoints, palette } = useTheme();
  const xsm = useMediaQuery(breakpoints.down('xsm'));
  const md = useMediaQuery(breakpoints.down('md'));
  const lg = useMediaQuery(breakpoints.up('lg'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const networkConfig = getNetworkConfig(chainId);
  let networkColor = '';
  if (networkConfig?.isFork) {
    networkColor = '#ff4a8d';
  } else if (networkConfig?.isTestnet) {
    networkColor = '#7157ff';
  } else {
    networkColor = '#65c970';
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!connected) {
      trackEvent(GENERAL.OPEN_MODAL, { modal: 'Connect Waller' });
      setWalletModalOpen(true);
    } else {
      setOpen(true);
      setAnchorEl(event.currentTarget);
    }
  };

  const handleDisconnect = () => {
    if (connected) {
      disconnectWallet();
      trackEvent(AUTH.DISCONNECT_WALLET);
      handleClose();
    }
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(currentAccount);
    trackEvent(AUTH.COPY_ADDRESS);
    handleClose();
  };

  const handleCopyReferralCode = async () => {
    navigator.clipboard.writeText('E24C0234B9');
    handleClose();
  };

  const handleSwitchWallet = (): void => {
    setWalletModalOpen(true);
    trackEvent(AUTH.SWITCH_WALLET);
    handleClose();
  };

  const handleViewOnExplorer = (): void => {
    trackEvent(GENERAL.EXTERNAL_LINK, { Link: 'Etherscan for Wallet' });
    handleClose();
  };

  const hideWalletAccountText = xsm && (ENABLE_TESTNET || STAGING_ENV || readOnlyModeAddress);
  console.log(networkConfig);
  const Content = ({ component = ListItem }: { component?: typeof MenuItem | typeof ListItem }) => (
    <>
      <Typography
        variant="subheader2"
        sx={{
          display: { xs: 'block', md: 'none' },
          color: '#A5A8B6',
          px: 4,
          py: 2,
        }}
      >
        <Trans>Account</Trans>
      </Typography>

      <Box component={component} disabled sx={{ my: 1, px: 1.5, py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          <UserDisplay
            avatarProps={{ size: AvatarSize.LG }}
            titleProps={{
              variant: 'body8',
              color: 'text.primary',
              addressCompactMode: CompactMode.MD,
            }}
            subtitleProps={{
              addressCompactMode: CompactMode.LG,
              typography: 'caption',
            }}
          />
          {readOnlyModeAddress && (
            <Warning severity="warning" sx={{ mt: 3, mb: 0 }}>
              <Trans>Read-only mode.</Trans>
            </Warning>
          )}
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: theme.palette.border.divider }} />

      <Box component={component} disabled sx={{ my: 1, px: 1.5, py: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Typography variant="detail2" color="text.mainTitle" sx={{ mb: 5 }}>
            <Trans>Network</Trans>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              style={{
                width: 24,
                height: 24,
                marginRight: '8px',
                borderRadius: '50%',
              }}
              src={networkConfig.networkLogoPath}
              alt={networkConfig.name}
            />
            <Typography variant="body6" color="text.secondary">
              {networkConfig.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: theme.palette.border.divider }} />

      <Box component={component} sx={{ my: 1, px: 1.5, py: 3 }} onClick={handleCopy}>
        <ListItemIcon sx={{ mr: 1 }}>
          <SvgIcon
            sx={(theme) => ({ fontSize: '24px !important', color: theme.palette.text.secondary })}
          >
            <DuplicateIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body5" color="text.mainTitle">
            <Trans>Copy address</Trans>
          </Typography>
        </ListItemText>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: theme.palette.border.divider }} />
      <Box component={component} sx={{ my: 1, px: 1.5, py: 3 }} onClick={handleCopyReferralCode}>
        <ListItemText>
          <Typography variant="body6" color="text.primary" sx={{ pl: 8 }}>
            <Trans>E24C0234B9</Trans>
          </Typography>
        </ListItemText>
        <ListItemIcon sx={{ mr: 0 }}>
          <SvgIcon
            sx={(theme) => ({ fontSize: '18px !important', color: theme.palette.text.secondary })}
          >
            <ArrowForwardIosIcon />
          </SvgIcon>
        </ListItemIcon>
      </Box>
      <Box component={component} sx={{ my: 1, px: 1.5, py: 3 }} onClick={handleCopyReferralCode}>
        <ListItemIcon sx={{ mr: 1 }}>
          <SvgIcon
            sx={(theme) => ({ fontSize: '24px !important', color: theme.palette.text.secondary })}
          >
            <AccountCircleOutlinedIcon />
          </SvgIcon>
        </ListItemIcon>
        <ListItemText>
          <Typography variant="body5" color="text.secondary">
            <Trans>Copy referral code</Trans>
          </Typography>
        </ListItemText>
      </Box>
      <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: theme.palette.border.divider }} />
      {networkConfig?.explorerLinkBuilder && (
        <Box>
          <Link href={networkConfig.explorerLinkBuilder({ address: currentAccount })}>
            <Box
              component={component}
              sx={{ my: 1, px: 1.5, py: 3 }}
              onClick={handleViewOnExplorer}
            >
              <ListItemIcon
                sx={{
                  mr: 1,
                }}
              >
                <SvgIcon
                  sx={(theme) => ({
                    fontSize: '24px !important',
                    color: theme.palette.text.secondary,
                  })}
                >
                  <CallMadeIcon />
                </SvgIcon>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body5" color="text.secondary">
                  <Trans>View on Explorer</Trans>
                </Typography>
              </ListItemText>
            </Box>
          </Link>
          <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: theme.palette.border.divider }} />
        </Box>
      )}
      {!md && (
        <Box component={component} sx={{ my: 1, px: 1.5, py: 3 }} onClick={handleDisconnect}>
          <ListItemIcon
            sx={{
              mr: 1,
            }}
          >
            <SvgIcon
              sx={(theme) => ({
                fontSize: '24px !important',
                color: theme.palette.text.secondary,
              })}
            >
              <LogoutOutlinedIcon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body5" color="text.secondary">
              <Trans>Disconnect</Trans>
            </Typography>
          </ListItemText>
        </Box>
        // <Box>
        //   <Button
        //     variant="outlined"
        //     sx={{
        //       padding: '0 5px',
        //       boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
        //     }}
        //     size="small"
        //     onClick={handleDisconnect}
        //     data-cy={`disconnect-wallet`}
        //   >
        //     Disconnect
        //   </Button>
        // </Box>
        // <Box sx={{ display: 'flex', flexDirection: 'row', padding: '0 16px 10px' }}>
        //   <Button
        //     variant="outlined"
        //     sx={{
        //       padding: '0 5px',
        //       marginRight: '10px',
        //     }}
        //     size="small"
        //     onClick={handleSwitchWallet}
        //   >
        //     Switch wallet
        //   </Button>
        // </Box>
      )}
      {md && (
        <>
          <Divider sx={{ my: { xs: 7, md: 0 }, borderColor: { xs: '#FFFFFF1F', md: 'divider' } }} />
          <Box sx={{ padding: '16px 16px 10px' }}>
            <Button
              sx={{
                marginBottom: '16px',
                background: '#383D51',
                color: '#F1F1F3',
              }}
              fullWidth
              size="large"
              variant={palette.mode === 'dark' ? 'outlined' : 'text'}
              onClick={handleSwitchWallet}
            >
              Switch wallet
            </Button>
            <Button
              sx={{
                background: '#383D51',
                color: '#F1F1F3',
              }}
              fullWidth
              size="large"
              variant={palette.mode === 'dark' ? 'outlined' : 'text'}
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          </Box>
        </>
      )}
    </>
  );

  return (
    <>
      {md && connected && open ? (
        <MobileCloseButton setOpen={setOpen} />
      ) : loading ? (
        <Skeleton height={'100%'} width={167} />
      ) : (
        <Button
          variant={connected ? 'surface' : 'gradient'}
          aria-label="wallet"
          id="wallet-button"
          aria-controls={open ? 'wallet-button' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
          sx={{
            p: 3,
            minWidth: hideWalletAccountText ? 'unset' : undefined,
            height: lg ? '48px' : '44px',
            background: 'transparent',
          }}
          endIcon={
            connected &&
            !hideWalletAccountText &&
            !md && (
              <SvgIcon
                sx={{
                  display: { xs: 'none', md: 'block', fontSize: '24px !important' },
                }}
              >
                {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </SvgIcon>
            )
          }
        >
          {connected ? (
            <UserDisplay
              avatarProps={{ size: 24 }}
              oneLiner={true}
              titleProps={{ variant: 'body5', color: 'text.primary', lineHeight: 0 }}
            />
          ) : (
            <Typography variant="body5">
              <Trans>Connect wallet</Trans>
            </Typography>
          )}
        </Button>
      )}

      {md ? (
        <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
          <List sx={{ px: 2, '.MuiListItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content />
          </List>
        </DrawerWrapper>
      ) : (
        <Menu
          id="wallet-menu"
          MenuListProps={{
            'aria-labelledby': 'wallet-button',
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          keepMounted={true}
          classes={{
            paper: classes.menuPaper,
          }}
        >
          <MenuList disablePadding sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}>
            <Content component={MenuItem} />
          </MenuList>
        </Menu>
      )}

      <WalletModal />
    </>
  );
}
