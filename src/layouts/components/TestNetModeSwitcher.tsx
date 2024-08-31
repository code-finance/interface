import { Trans } from '@lingui/macro';
import {
  Box,
  FormControlLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Switch,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useRootStore } from 'src/store/root';
import { SETTINGS } from 'src/utils/mixPanelEvents';

interface TestNetModeSwitcherProps {
  component?: typeof MenuItem | typeof ListItem;
}

export const TestNetModeSwitcher = ({ component = ListItem }: TestNetModeSwitcherProps) => {
  const testnetsEnabledId = 'testnetsEnabled';
  const testnetsEnabledLocalstorage = localStorage.getItem(testnetsEnabledId) === 'true' || false;
  const [testnetsEnabled, setTestnetsMode] = useState(testnetsEnabledLocalstorage);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const toggleTestnetsEnabled = () => {
    const newState = !testnetsEnabled;
    setTestnetsMode(!testnetsEnabled);
    localStorage.setItem(testnetsEnabledId, newState ? 'true' : 'false');
    // Set window.location to trigger a page reload when navigating to the the dashboard
    window.location.href = '/';
  };

  return (
    <Box component={component} onClick={toggleTestnetsEnabled} sx={{ px: 1.5, py: '9px' }}>
      <ListItemText>
        <Typography variant="body5" color="text.primary">
          <Trans>Testnet mode</Trans>
        </Typography>
      </ListItemText>
      <FormControlLabel
        sx={{ mx: 0 }}
        value="testnetsMode"
        control={
          <Switch
            disableRipple
            onClick={() => trackEvent(SETTINGS.TESTNET_MODE)}
            checked={testnetsEnabled}
            sx={{ ml: 1 }}
          />
        }
        label={
          <Typography variant="body5" color="text.primary">
            {testnetsEnabled ? 'on' : 'off'}
          </Typography>
        }
        labelPlacement="start"
      />
    </Box>
  );
};
