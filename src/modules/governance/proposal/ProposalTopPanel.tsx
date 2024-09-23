import { ArrowLeftIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';
import { AIP } from 'src/utils/mixPanelEvents';

import { TopInfoPanel } from '../../../components/TopInfoPanel/TopInfoPanel';

export const ProposalTopPanel = () => {
  const theme = useTheme();
  const trackEvent = useRootStore((store) => store.trackEvent);
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));

  return (
    <TopInfoPanel isGovernanceDetails>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          bgcolor: 'background.primary',
          border: '1px solid',
          borderColor: 'text.subText',
        }}
      >
        <Button
          sx={{ px: '12px !important', py: xsm ? '12px !important' : '9px !important' }}
          component={Link}
          href={ROUTES.governance}
          variant="surface"
          size="medium"
          onClick={() => trackEvent(AIP.GO_BACK)}
          color="primary"
          startIcon={
            <SvgIcon fontSize="small">
              <ArrowLeftIcon />
            </SvgIcon>
          }
        >
          <Typography variant="body7" color="text.primary">
            <Trans>Go Back</Trans>
          </Typography>
        </Button>
      </Box>
    </TopInfoPanel>
  );
};
