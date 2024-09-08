import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import React, { ComponentProps } from 'react';

import { FormattedNumber } from './primitives/FormattedNumber';

type ReserveSubheaderProps = {
  value: string;
  rightAlign?: boolean;
  variant?: ComponentProps<typeof Typography>['variant'];
};

export function ReserveSubheader({
  value,
  rightAlign,
  variant = 'detail2',
}: ReserveSubheaderProps) {
  return (
    <Box
      sx={{
        p: rightAlign ? { xs: '0', xsm: '2px 0' } : { xs: '0', xsm: '3.625px 0px' },
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {value === 'Disabled' ? (
        <Typography component="span" sx={{ mr: 0.5 }} variant={variant} color="text.mainTitle">
          (<Trans>Disabled</Trans>)
        </Typography>
      ) : (
        <FormattedNumber
          compact
          value={value}
          variant={variant}
          color="text.secondary"
          symbolsVariant={variant}
          symbolsColor="text.secondary"
          symbol="USD"
        />
      )}
    </Box>
  );
}
