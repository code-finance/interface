import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Typography, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { FormattedNumber } from './primitives/FormattedNumber';

interface HealthFactorNumberProps extends TypographyProps {
  value: string;
  onInfoClick?: () => void;
}

export const HealthFactorNumber = ({ value, onInfoClick, ...rest }: HealthFactorNumberProps) => {
  const { palette } = useTheme();

  const formattedHealthFactor = Number(valueToBigNumber(value).toFixed(2, BigNumber.ROUND_DOWN));
  let healthFactorColor = '';
  if (formattedHealthFactor >= 3) {
    healthFactorColor = palette.success.main;
  } else if (formattedHealthFactor < 1.1) {
    healthFactorColor = palette.error.main;
  } else {
    healthFactorColor = palette.warning.main;
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      }}
      data-cy={'HealthFactorTopPannel'}
    >
      {value === '-1' ? (
        <Typography variant="secondary14" color={palette.success.main}>
          ∞
        </Typography>
      ) : (
        <FormattedNumber
          value={formattedHealthFactor}
          sx={{ color: healthFactorColor, ...rest.sx }}
          visibleDecimals={2}
          compact
          {...rest}
        />
      )}

      {onInfoClick && (
        <Box
          onClick={onInfoClick}
          sx={(theme) => ({
            px: 2,
            py: '3px',
            border: `1px solid ${theme.palette.border.contents}`,
            ...theme.typography.detail2,
            cursor: 'pointer',
            borderRadius: 1,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
            transition: '0.3s',
            '&:hover': {
              opacity: 0.8,
            },
          })}
        >
          <Trans>Risk details</Trans>
        </Box>
      )}
    </Box>
  );
};
