import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

interface TopInfoPanelItemProps {
  icon?: ReactNode;
  title: ReactNode;
  titleIcon?: ReactNode;
  children: ReactNode;
  hideIcon?: boolean;
  withoutIconWrapper?: boolean;
  variant?: 'light' | 'dark' | undefined; // default dark
  withLine?: boolean;
  loading?: boolean;
  sx?: ComponentProps<typeof Box>['sx'];
}

export const TopInfoPanelItem = ({
  icon,
  title,
  titleIcon,
  children,
  hideIcon,
  withLine,
  loading,
  withoutIconWrapper,
  sx,
}: TopInfoPanelItemProps) => {
  const theme = useTheme();
  const upToSM = useMediaQuery(theme.breakpoints.up('sm'));
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));

  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          minWidth: xsm ? '170px' : '150px',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {withLine && (
        <Box
          sx={{
            mr: 8,
            my: 'auto',
            width: '1px',
            bgcolor: '#F2F3F729',
            height: '37px',
          }}
        />
      )}

      {!hideIcon &&
        (withoutIconWrapper ? (
          icon && icon
        ) : (
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #EBEBED1F',
              borderRadius: '12px',
              bgcolor: '#383D51',
              boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
              width: 42,
              height: 42,
              mr: 3,
            }}
          >
            {icon && icon}
          </Box>
        ))}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: xsm ? 2 : 0, width: '100%' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography variant={xsm ? 'body3' : 'detail3'} color="text.secondary">
            {title}
          </Typography>
          {titleIcon && titleIcon}
        </Box>

        {loading ? (
          <Skeleton
            width={60}
            height={upToSM ? 28 : 24}
            sx={(theme) => ({ background: theme.palette.background.modulePopup, mt: 1 })}
          />
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};
