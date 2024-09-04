import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { AlertColor, Box, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import React from 'react';

import { FormattedNumber } from '../../../../components/primitives/FormattedNumber';

interface LTVContentProps {
  loanToValue: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
  color: AlertColor;
}

export const LTVContent = ({
  loanToValue,
  currentLoanToValue,
  currentLiquidationThreshold,
}: LTVContentProps) => {
  const LTVLineWidth = valueToBigNumber(loanToValue)
    .multipliedBy(100)
    .precision(20, BigNumber.ROUND_UP)
    .toNumber();

  const CurrentLTVLineWidth = valueToBigNumber(currentLoanToValue)
    .multipliedBy(100)
    .precision(20, BigNumber.ROUND_UP)
    .toNumber();

  const currentLiquidationThresholdLeftPosition = valueToBigNumber(currentLiquidationThreshold)
    .multipliedBy(100)
    .precision(20, BigNumber.ROUND_UP)
    .toNumber();

  const dotPosition = +loanToValue <= 0 ? 100 : 100 - LTVLineWidth;
  const thresholdPosition =
    currentLiquidationThresholdLeftPosition <= 0
      ? 100
      : 100 - currentLiquidationThresholdLeftPosition;
  return (
    <Box sx={{ position: 'relative', margin: '45px 0 55px' }}>
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
              left: dotPosition > 98 ? 'auto' : '50%',
              right: dotPosition > 98 ? 0 : 'auto',
              transform: dotPosition > 98 ? 'translateX(0)' : 'translateX(-50%)',
            },
          })}
        >
          <Box
            sx={{
              display: 'flex',
              position: 'absolute',
              left: dotPosition > 98 ? 'auto' : dotPosition < 4 ? '0' : '50%',
              transform: dotPosition > 98 || dotPosition < 4 ? 'translateX(0)' : 'translateX(-50%)',
              right: dotPosition > 98 ? 0 : 'auto',
              flexDirection: 'column',
              alignItems: dotPosition > 98 ? 'flex-end' : dotPosition < 4 ? 'flex-start' : 'center',
              textAlign: dotPosition > 98 ? 'right' : dotPosition < 4 ? 'left' : 'center',
              bottom: 'calc(100% + 2px)',
            }}
          >
            <FormattedNumber
              value={loanToValue}
              percent
              visibleDecimals={2}
              variant="detail2"
              color="text.primary"
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          height: '8px',
          width: '100%',
          position: 'relative',
          borderRadius: '6px',
          transform: 'matrix(-1, 0, 0, 1, 0, 0)',
          background: 'linear-gradient(90deg, #1FC74E 0%, #FF8080 50%, #FF2D2D 100%)',
        }}
      />
      <Box
        sx={{
          maxWidth: '20%',
          textAlign: 'center',
          pt: 2,
          '&:after': {
            content: "''",
            position: 'absolute',
            bottom: '13%',
            left: `${thresholdPosition > 100 ? 100 : thresholdPosition}%`,
            transform: 'translateX(-50%)',
            height: '20px',
            width: '2px',
            bgcolor: 'error.main',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            flexDirection: 'column',
            textAlign:
              thresholdPosition > 90 ? 'right' : thresholdPosition < 15 ? 'left' : 'center',
            alignItems:
              thresholdPosition > 90
                ? 'flex-end'
                : thresholdPosition < 15
                ? 'flex-start'
                : 'center',
            transform:
              thresholdPosition > 90 || thresholdPosition < 15
                ? 'translateX(0)'
                : 'translateX(-50%)',
            right: thresholdPosition > 90 ? 0 : 'auto',
            left:
              thresholdPosition > 90
                ? 'auto'
                : thresholdPosition < 10
                ? '0'
                : `${thresholdPosition > 100 ? 100 : thresholdPosition}%`,
          }}
        >
          <FormattedNumber
            value={currentLiquidationThreshold}
            visibleDecimals={2}
            color="error.main"
            variant="detail1"
            percent
            symbolsColor="error.main"
          />
          <Typography sx={{ display: 'flex', width: '80%' }} variant="detail4" color="error.main">
            <Trans>Liquidation threshold</Trans>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
