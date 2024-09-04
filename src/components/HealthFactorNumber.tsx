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
  let healthFactorText = '';
  if (formattedHealthFactor >= 3) {
    healthFactorColor = palette.success.main;
    healthFactorText = 'Low Risk';
  } else if (formattedHealthFactor < 1.1) {
    healthFactorColor = palette.error.main;
    healthFactorText = 'High Risk';
  } else {
    healthFactorColor = palette.warning.main;
    healthFactorText = 'Medium Risk';
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
      <Box sx={{ color: healthFactorColor, p: '3px 6px', borderRadius: 1, ...rest.sx }} {...rest}>
        {healthFactorText}
      </Box>

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
