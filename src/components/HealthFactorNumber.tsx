import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useTheme } from '@mui/material';
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
        gap: 3,
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
        <Button
          onClick={onInfoClick}
          sx={(theme) => ({
            px: 2,
            py: '3px',
            border: `1px solid ${theme.palette.border.contents}`,
            ...theme.typography.detail2,
            color: theme.palette.text.secondary,
            borderRadius: 1,
          })}
          size="small"
          variant="transparent"
        >
          <Trans>Risk details</Trans>
        </Button>
      )}
    </Box>
  );
};
