import { InformationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Link, SvgIcon, Typography, TypographyProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import { ContentWithTooltip } from '../ContentWithTooltip';

const contentSx = {
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': { opacity: 0.6 },
  height: '24px',
  padding: '3px 4px',
};

interface InfoIconProps {
  color?: string;
}

const InfoIcon = ({ color }: InfoIconProps) => (
  <SvgIcon
    sx={{
      ml: '3px',
      color: color ? color : 'text.muted',
      fontSize: '16px',
    }}
  >
    <InformationCircleIcon />
  </SvgIcon>
);
export const IsolatedEnabledBadge = ({
  typographyProps,
}: {
  typographyProps?: TypographyProps;
}) => {
  const theme = useTheme();

  const sx = {
    border: `1px solid ${theme.palette.warning.main}`,
    color: theme.palette.warning.main,
    ...contentSx,
  };
  return (
    <ContentWithTooltip
      withoutHover
      tooltipContent={
        <IsolationModeTooltipTemplate
          content={
            <Trans>
              Isolated assets have limited borrowing power and other assets cannot be used as
              collateral.
            </Trans>
          }
        />
      }
    >
      <Box sx={sx}>
        <Typography
          variant="secondary12"
          sx={{
            lineHeight: '0.75rem',
          }}
          color={theme.palette.warning.main}
          {...typographyProps}
        >
          <Trans>Isolated</Trans>
        </Typography>
        <InfoIcon color={theme.palette.warning.main} />
      </Box>
    </ContentWithTooltip>
  );
};

export const IsolatedDisabledBadge = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <IsolationModeTooltipTemplate
          content={
            <Trans>
              Asset can be only used as collateral in isolation mode with limited borrowing power.
              To enter isolation mode, disable all other collateral.
            </Trans>
          }
        />
      }
    >
      <Box sx={contentSx}>
        <Typography variant="description" color="error.main">
          <Trans>Unavailable</Trans>
        </Typography>
        <Typography
          color="warning.main"
          sx={{ lineHeight: 1, display: 'flex', alignItems: 'center' }}
        >
          <InfoIcon />
        </Typography>
      </Box>
    </ContentWithTooltip>
  );
};

export const UnavailableDueToIsolationBadge = () => {
  return (
    <ContentWithTooltip
      tooltipContent={
        <IsolationModeTooltipTemplate
          content={<Trans>Collateral usage is limited because of isolation mode.</Trans>}
        />
      }
    >
      <Box sx={contentSx}>
        <Typography variant="body7" color="warning.main">
          <Trans>Unavailable</Trans>
        </Typography>
        <Typography
          color="warning.main"
          sx={{ lineHeight: 1, display: 'flex', alignItems: 'center' }}
        >
          <InfoIcon />
        </Typography>
      </Box>
    </ContentWithTooltip>
  );
};

const IsolationModeTooltipTemplate = ({ content }: { content: ReactNode }) => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>{content}</Box>
      <Typography variant="subheader2" color="text.secondary">
        <Trans>Please see our FAQ guide for more details.</Trans>
      </Typography>
    </Box>
  );
};
