import { Trans } from '@lingui/macro';
import {
  Box,
  FormControlLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useRootStore } from 'src/store/root';
import { SETTINGS } from 'src/utils/mixPanelEvents';

import { ColorModeContext } from '../AppGlobalStyles';

interface DarkModeSwitcherProps {
  component?: typeof MenuItem | typeof ListItem;
}

export const DarkModeSwitcher = ({ component = ListItem }: DarkModeSwitcherProps) => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Box
      component={component}
      onClick={colorMode.toggleColorMode}
      sx={{ px: { xs: 0, lg: 1.5 }, py: '9px' }}
    >
      <ListItemText>
        <Typography variant="body5" color="text.primary">
          <Trans>Dark mode</Trans>
        </Typography>
      </ListItemText>
      <FormControlLabel
        value="darkmode"
        sx={{ mx: 0 }}
        control={
          <Switch
            onClick={() => trackEvent(SETTINGS.DARK_MODE, { mode: theme.palette.mode })}
            disableRipple
            checked={theme.palette.mode === 'dark'}
            sx={{ ml: 1 }}
          />
        }
        label={
          <Typography variant="body5" color="text.primary">
            {theme.palette.mode === 'dark' ? 'on' : 'off'}
          </Typography>
        }
        labelPlacement="start"
      />
    </Box>
  );
};
