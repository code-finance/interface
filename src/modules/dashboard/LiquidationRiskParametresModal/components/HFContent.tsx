import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React from 'react';

import { FormattedNumber } from '../../../../components/primitives/FormattedNumber';

interface HFContentProps {
  healthFactor: string;
}

export const HFContent = ({ healthFactor }: HFContentProps) => {
  const formattedHealthFactor = Number(
    valueToBigNumber(healthFactor).toFixed(2, BigNumber.ROUND_DOWN)
  );

  const dotPosition = +healthFactor > 10 ? 100 : +healthFactor * 10;

  return (
    <Box sx={{ position: 'relative', mt: '33px', mb: 4 }}>
      <Box
        sx={{
          height: '8px',
          background: 'linear-gradient(90deg, #1FC74E 0%, #FF8080 50%, #FF2D2D 100%)',
          borderRadius: '6px',
          transform: 'matrix(-1, 0, 0, 1, 0, 0)',
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 'calc(100% + 10px)',
          left: `${dotPosition > 100 ? 100 : dotPosition}%`,
          zIndex: 3,
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'relative',
            whiteSpace: 'nowrap',
            '&:after': {
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '6px 4px 0 4px',
              borderColor: `${theme.palette.text.primary} transparent transparent transparent`,
              content: "''",
              position: 'absolute',
              left: dotPosition > 75 ? 'auto' : '50%',
              right: dotPosition > 75 ? 0 : 'auto',
              transform: dotPosition > 75 ? 'translateX(0)' : 'translateX(-50%)',
            },
          })}
        >
          <Box
            sx={{
              display: 'flex',
              position: 'absolute',
              left: dotPosition > 75 ? 'auto' : dotPosition < 15 ? '0' : '50%',
              transform:
                dotPosition > 75 || dotPosition < 15 ? 'translateX(0)' : 'translateX(-50%)',
              right: dotPosition > 75 ? 0 : 'auto',
              flexDirection: 'column',
              alignItems:
                dotPosition > 75 ? 'flex-end' : dotPosition < 15 ? 'flex-start' : 'center',
              textAlign: dotPosition > 75 ? 'right' : dotPosition < 15 ? 'left' : 'center',
              bottom: 'calc(100% + 2px)',
            }}
          >
            <FormattedNumber value={formattedHealthFactor} variant="main12" visibleDecimals={2} />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: '20%',
          textAlign: 'center',
          pt: 2,
          '&:after': {
            content: "''",
            position: 'absolute',
            bottom: '79%',
            left: '10%',
            transform: 'translateX(-50%)',
            height: '20px',
            width: '2px',
            bgcolor: 'error.main',
          },
        }}
      >
        <FormattedNumber value={1} visibleDecimals={2} color="error.main" variant="detail1" />
        <Typography
          sx={{ display: 'flex', width: '80%', mx: 'auto' }}
          variant="detail4"
          color="error.main"
        >
          <Trans>Liquidation value</Trans>
        </Typography>
      </Box>
    </Box>
  );
};
