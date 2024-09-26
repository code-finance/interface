import { useLingui } from '@lingui/react';
import { Button, List, ListItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { useRootStore } from 'src/store/root';
import { NAV_BAR } from 'src/utils/mixPanelEvents';

import { Link } from '../../components/primitives/Link';
import { useProtocolDataContext } from '../../hooks/useProtocolDataContext';
import { navigation } from '../../ui-config/menu-items';
import { MoreMenu } from '../MoreMenu';
import { useRouter } from 'next/router';

interface NavItemsProps {
  setOpen?: (value: boolean) => void;
}

export const NavItems = ({ setOpen }: NavItemsProps) => {
  const { i18n } = useLingui();
  const { currentMarketData } = useProtocolDataContext();
  const router = useRouter();
  const { breakpoints } = useTheme();
  const lg = useMediaQuery(breakpoints.down('lg'));
  const trackEvent = useRootStore((store) => store.trackEvent);
  const handleClick = (title: string, isMd: boolean) => {
    if (isMd && setOpen) {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
      setOpen(false);
    } else {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
    }
  };
  return (
    <List
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', lg: 'center' },
        flexDirection: { xs: 'column', lg: 'row' },
        width: '100%',
        justifyContent: 'center',
        gap: { xs: 4, lg: 6 },
      }}
      disablePadding
    >
      {navigation
        .filter((item) => !item.isVisible || item.isVisible(currentMarketData))
        .map((item, index) => (
          <ListItem
            sx={{
              height: '100%',
              width: { xs: '100%', lg: 'fit-content' },
              mr: { xs: 0, lg: 2 },
              px: { xs: 0, xsm: undefined },
            }}
            data-cy={item.dataCy}
            disablePadding
            key={index}
          >
            {lg ? (
              <Typography
                component={Link}
                href={item.link}
                color="text.mainTitle"
                variant="h2"
                sx={(theme) => ({
                  color: theme.palette.text.mainTitle,
                  transition: '0.3s',
                  lineHeight: 1,
                  width: '100%',
                  p: '8px 16px',
                  ...theme.typography.h4,
                  '&.active': { ...theme.typography.h3, color: theme.palette.text.primary },
                })}
                className={
                  item.activeChildren?.some((route) => router.pathname.startsWith(route))
                    ? 'active'
                    : ''
                }
                onClick={() => {
                  handleClick(item.title, true);
                  setOpen && setOpen(false);
                }}
              >
                {i18n._(item.title)}
              </Typography>
            ) : (
              <Typography
                component={Link}
                color="text.mainTitle"
                href={item.link}
                sx={(theme) => ({
                  color: theme.palette.text.mainTitle,
                  transition: '0.3s',
                  lineHeight: 1,
                  ...theme.typography.h4,
                  '&.active': { ...theme.typography.h3, color: theme.palette.text.primary },
                  ':hover': { opacity: 0.7 },
                })}
                className={
                  item.activeChildren?.some((route) => router.pathname.startsWith(route))
                    ? 'active'
                    : ''
                }
              >
                {i18n._(item.title)}
              </Typography>
            )}
          </ListItem>
        ))}

      {/* <ListItem sx={{ display: { xs: 'none', lg: 'flex' }, width: 'unset' }} disablePadding>
        <MoreMenu />
      </ListItem> */}
    </List>
  );
};
