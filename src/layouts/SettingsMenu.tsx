import { CogIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Button, Menu, MenuItem, SvgIcon, Typography, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box, Theme } from '@mui/system';
import React, { useState } from 'react';
import { DEFAULT_LOCALE } from 'src/libs/LanguageProvider';
import { useRootStore } from 'src/store/root';
import { PROD_ENV } from 'src/utils/marketsAndNetworksConfig';
import { SETTINGS } from 'src/utils/mixPanelEvents';

import { DarkModeSwitcher } from './components/DarkModeSwitcher';
import { LanguageListItem, LanguagesList } from './components/LanguageSwitcher';
import { TestNetModeSwitcher } from './components/TestNetModeSwitcher';

export const LANG_MAP = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  el: 'Greek',
};
type LanguageCode = keyof typeof LANG_MAP;

// Define the type for the language codes

// Example usage

const useStyles = makeStyles(() => ({
  menuPaper: {
    boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)',
    padding: '20px 12px',
    borderRadius: '12px',
    width: '300px',
  },
}));

export function SettingsMenu() {
  const classes = useStyles();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [languagesOpen, setLanguagesOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const trackEvent = useRootStore((store) => store.trackEvent);
  const theme = useTheme();
  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
    setSettingsOpen(true);
    setLanguagesOpen(false);
  };

  const handleLanguageClick = () => {
    const savedLocale = localStorage.getItem('LOCALE') || DEFAULT_LOCALE;
    const langCode = savedLocale as LanguageCode;
    setSettingsOpen(false);
    setLanguagesOpen(true);
    trackEvent(SETTINGS.LANGUAGE, { language: LANG_MAP[langCode] });
  };

  const handleCloseLanguage = () => {
    setSettingsOpen(true);
    setLanguagesOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSettingsOpen(false);
    setLanguagesOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          p: 0,
          bgcolor: theme.palette.background.modulePopup,
          ml: 2,
          height: '48px',
          width: '48px',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Button
          variant="surface"
          aria-label="settings"
          id="settings-button"
          aria-controls={settingsOpen ? 'settings-menu' : undefined}
          aria-expanded={settingsOpen ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleSettingsClick}
          sx={{
            p: 3,
            minWidth: 'unset',
            background: 'transparent',
          }}
        >
          <SvgIcon sx={{ color: theme.palette.text.primary, fontSize: '24px !important' }}>
            <CogIcon />
          </SvgIcon>
        </Button>
      </Box>
      <Menu
        id="settings-menu"
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorEl={anchorEl}
        open={settingsOpen}
        onClose={handleClose}
        classes={{
          paper: classes.menuPaper,
        }}
        sx={{ '.MuiMenuItem-root.Mui-disabled': { opacity: 1 } }}
        keepMounted={true}
      >
        <Box sx={{ px: 1.5, py: '9px' }}>
          <Typography variant="detail2" color="text.mainTitle">
            <Trans>Settings</Trans>
          </Typography>
        </Box>

        <DarkModeSwitcher />
        {PROD_ENV && <TestNetModeSwitcher />}
        <LanguageListItem onClick={handleLanguageClick} />
      </Menu>

      <Menu
        id="settings-menu"
        MenuListProps={{
          'aria-labelledby': 'settings-button',
        }}
        anchorEl={anchorEl}
        open={languagesOpen}
        onClose={handleClose}
        keepMounted={true}
        classes={{
          paper: classes.menuPaper,
        }}
      >
        <LanguagesList onClick={handleCloseLanguage} component={MenuItem} />
      </Menu>
    </>
  );
}
