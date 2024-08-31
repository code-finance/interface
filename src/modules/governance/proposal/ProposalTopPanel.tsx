import { ArrowLeftIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import * as React from 'react';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';
import { AIP } from 'src/utils/mixPanelEvents';

import { TopInfoPanel } from '../../../components/TopInfoPanel/TopInfoPanel';

export const ProposalTopPanel = () => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <TopInfoPanel isGovernanceDetails>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // padding: '12px',
          borderRadius: '8px',
          bgcolor: 'background.primary',
          border: '1px solid',
          borderColor: 'text.subText',
        }}
      >
        <Button
          sx={{ px: '12px !important' }}
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
