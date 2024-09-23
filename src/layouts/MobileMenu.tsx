import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from '@mui/material';
import React, { ReactNode, useEffect, useState } from 'react';
import { PROD_ENV } from 'src/utils/marketsAndNetworksConfig';

import { Link } from '../components/primitives/Link';
import { moreNavigation } from '../ui-config/menu-items';
import { DarkModeSwitcher } from './components/DarkModeSwitcher';
import { DrawerWrapper } from './components/DrawerWrapper';
import { LanguageListItem, LanguagesList } from './components/LanguageSwitcher';
import { MobileCloseButton } from './components/MobileCloseButton';
import { NavItems } from './components/NavItems';
import { TestNetModeSwitcher } from './components/TestNetModeSwitcher';

interface MobileMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

const MenuItemsWrapper = ({
  children,
  title,
  mb,
}: {
  children: ReactNode;
  title: ReactNode;
  mb?: number;
}) => (
  <Box sx={{ '&:last-of-type': { mb: 0, '.MuiDivider-root': { display: 'none' } } }}>
    <Box sx={{ px: { xs: 1, xsm: 2 } }}>
      <Typography
        variant="detail2"
        sx={{ px: 4, py: { xs: 0, xsm: 2 }, mb: { xs: mb ?? 3, xsm: 0 } }}
        color="text.subTitle"
        component="div"
      >
        {title}
      </Typography>

      {children}
    </Box>

    <Divider sx={(theme) => ({ borderColor: theme.palette.border.contents, my: 7, mx: 5 })} />
  </Box>
);

export const MobileMenu = ({ open, setOpen, headerHeight }: MobileMenuProps) => {
  const { i18n } = useLingui();
  const [isLanguagesListOpen, setIsLanguagesListOpen] = useState(false);

  useEffect(() => setIsLanguagesListOpen(false), [open]);

  return (
    <>
      <Button
        id="settings-button-mobile"
        sx={{
          p: 2,
          minWidth: 'unset',
          ml: 2,
          width: '40px',
          height: '40px',
          border: 'none',
          background: 'transparent',
        }}
        onClick={() => setOpen(!open)}
      >
        <SvgIcon sx={{ color: 'text.secondary' }} fontSize="small">
          {!open ? <MenuIcon /> : <XIcon />}
        </SvgIcon>
      </Button>

      <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>
        {!isLanguagesListOpen ? (
          <>
            <MenuItemsWrapper title={<Trans>Menu</Trans>}>
              <NavItems />
            </MenuItemsWrapper>
            <MenuItemsWrapper title={<Trans>Global settings</Trans>} mb={7}>
              <List sx={{ p: { xs: '8px 16px', lg: 0 } }}>
                <DarkModeSwitcher />
                {PROD_ENV && <TestNetModeSwitcher />}
                <LanguageListItem onClick={() => setIsLanguagesListOpen(true)} />
              </List>
            </MenuItemsWrapper>
            {/*<MenuItemsWrapper title={<Trans>Links</Trans>}>*/}
            {/*  <List>*/}
            {/*    <ListItem*/}
            {/*      sx={{ color: '#F1F1F3' }}*/}
            {/*      component={Link}*/}
            {/*      href={'/v3-migration'}*/}
            {/*      onClick={() => setOpen(false)}*/}
            {/*    >*/}
            {/*      <ListItemText>*/}
            {/*        <Trans>Migrate to Aave V3</Trans>*/}
            {/*      </ListItemText>*/}
            {/*    </ListItem>*/}
            {/*    {moreNavigation.map((item, index) => (*/}
            {/*      <ListItem component={Link} href={item.link} sx={{ color: '#F1F1F3' }} key={index}>*/}
            {/*        <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>*/}
            {/*          <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>{item.icon}</SvgIcon>*/}
            {/*        </ListItemIcon>*/}

            {/*        <ListItemText>{i18n._(item.title)}</ListItemText>*/}
            {/*      </ListItem>*/}
            {/*    ))}*/}
            {/*  </List>*/}
            {/*</MenuItemsWrapper>*/}
          </>
        ) : (
          <List sx={{ px: 2 }}>
            <LanguagesList onClick={() => setIsLanguagesListOpen(false)} />
          </List>
        )}
      </DrawerWrapper>
    </>
  );
};
