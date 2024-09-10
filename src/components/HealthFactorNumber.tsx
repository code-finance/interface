import { valueToBigNumber } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TypographyProps } from '@mui/material/Typography';
import BigNumber from 'bignumber.js';

import { FormattedNumber } from './primitives/FormattedNumber';
import { TextWithTooltip } from './TextWithTooltip';

interface HealthFactorNumberProps extends TypographyProps {
  value: string;
  isHeader?: boolean;
  onInfoClick?: () => void;
}

export const HealthFactorNumber = ({
  value,
  onInfoClick,
  isHeader,
  ...rest
}: HealthFactorNumberProps) => {
  const { palette } = useTheme();
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));

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
      <Box sx={{ color: healthFactorColor, borderRadius: 1, ...rest.sx }} {...rest}>
        {isHeader ? (
          <Box
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              color: theme.palette.text.primary,
            })}
          >
            <FormattedNumber
              variant="body1"
              symbolsVariant="body1"
              symbolsColor={healthFactorColor}
              color={healthFactorColor}
              percent
              value={formattedHealthFactor / 100}
            />
            <TextWithTooltip iconSize={18} sx={{ color: 'inherit' }}>
              <>{healthFactorText}</>
            </TextWithTooltip>
          </Box>
        ) : (
          healthFactorText
        )}
      </Box>

      {onInfoClick && (
        <Button onClick={onInfoClick} variant="transparent-link">
          <Trans>Risk details</Trans>
        </Button>
      )}
    </Box>
  );
};
