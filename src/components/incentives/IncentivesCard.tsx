import { ReserveIncentiveResponse } from '@aave/math-utils/dist/esm/formatters/incentive/calculate-reserve-incentives';
import { Box, Typography } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

import { FormattedNumber } from '../primitives/FormattedNumber';
import { NoData } from '../primitives/NoData';
import { IncentivesButton } from './IncentivesButton';

interface IncentivesCardProps {
  symbol: string;
  value: string | number;
  incentives?: ReserveIncentiveResponse[];
  variant?: ComponentProps<typeof Typography>['variant'];
  symbolsVariant?: ComponentProps<typeof Typography>['variant'];
  align?: 'center' | 'flex-end';
  color?: string;
  tooltip?: ReactNode;
}

export const IncentivesCard = ({
  symbol,
  value,
  incentives,
  variant = 'secondary14',
  symbolsVariant,
  align,
  color,
  tooltip,
}: IncentivesCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align || { xs: 'flex-end', xsm: 'center' },
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {value.toString() !== '-1' ? (
        <Box sx={{ display: 'flex' }}>
          <FormattedNumber
            data-cy={`apy`}
            value={value}
            percent
            variant={variant}
            symbolsVariant={symbolsVariant}
            color={color || 'text.secondary'}
            symbolsColor={color || 'text.secondary'}
          />
          {tooltip}
        </Box>
      ) : (
        <NoData variant={variant} color={color || 'text.secondary'} />
      )}

      <IncentivesButton incentives={incentives} symbol={symbol} />
    </Box>
  );
};
