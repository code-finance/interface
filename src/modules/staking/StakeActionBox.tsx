import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { ReactNode } from 'react';

import { FormattedNumber } from '../../components/primitives/FormattedNumber';
import { Row } from '../../components/primitives/Row';

interface StakeActionBoxProps {
  title: ReactNode;
  value: string;
  valueUSD: string;
  children: ReactNode;
  bottomLineTitle: ReactNode;
  bottomLineComponent: ReactNode;
  cooldownAmount?: ReactNode;
  gradientBorder?: boolean;
  dataCy: string;
}

export const StakeActionBox = ({
  title,
  value,
  valueUSD,
  children,
  bottomLineTitle,
  bottomLineComponent,
  // gradientBorder,
  dataCy,
  cooldownAmount,
}: StakeActionBoxProps) => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        height: '292px',
        borderRadius: '12px',
        '&:after': {
          content: "''",
          borderRadius: '6px',
          position: 'absolute',
          top: -1,
          bottom: -1,
          left: -1,
          right: -1,
          // background: gradientBorder ? theme.palette.gradients.aaveGradient : 'transparent',
        },
      })}
    >
      <Box
        sx={(theme) => ({
          flex: 1,
          p: xsm ? '40px 16px 20px 16px' : '16px',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          borderRadius: '6px',
          color: theme.palette.text.subTitle,
          bgcolor: 'transparent',
          position: 'relative',
          zIndex: 2,
        })}
        data-cy={dataCy}
      >
        <Box
          sx={{
            mb: xsm ? '36px' : '24px',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Typography
            variant={xsm ? 'body7' : 'description'}
            mb={xsm ? 0 : '4px'}
            color={theme.palette.text.disabledText}
          >
            {title}
          </Typography>

          <FormattedNumber
            sx={{ my: xsm ? '10px' : 0 }}
            value={value}
            visibleDecimals={2}
            variant={xsm ? 'h2' : 'h3'}
            color={+value === 0 ? theme.palette.text.disabledText : 'text.primary'}
            data-cy={`amountNative`}
          />
          <FormattedNumber
            value={valueUSD}
            symbol="USD"
            visibleDecimals={2}
            variant="secondary12"
            color={+valueUSD === 0 ? theme.palette.text.disabledText : 'text.secondary'}
            symbolsColor={+valueUSD === 0 ? theme.palette.text.disabledText : 'text.secondary'}
            data-cy={`amountUSD`}
          />
        </Box>

        <Box sx={{ width: '100%', mb: xsm ? '10px' : '8px' }}>{children}</Box>

        <Row caption={bottomLineTitle} captionVariant="caption" width="100%">
          {bottomLineComponent}
        </Row>
        {cooldownAmount}
      </Box>
    </Box>
  );
};
