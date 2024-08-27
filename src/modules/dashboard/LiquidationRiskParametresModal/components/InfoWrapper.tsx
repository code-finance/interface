import { AlertColor, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface InfoWrapperProps {
  topValue: ReactNode;
  topTitle: ReactNode;
  topDescription: ReactNode;
  children: ReactNode;
  bottomText: ReactNode;
  color: AlertColor;
}

export const InfoWrapper = ({
  topValue,
  topTitle,
  topDescription,
  children,
  bottomText,
  color,
}: InfoWrapperProps) => {
  return (
    <Box
      sx={(theme) => ({
        mb: 6,
        borderRadius: '8px',
        px: 3,
        py: 4,
        backgroundColor: theme.palette.background.secondary,
        '&:last-of-type': {
          mb: 0,
        },
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ width: 'calc(100% - 72px)' }}>
          <Typography variant="body4" color="text.secondary" mb={3} component="div">
            {topTitle}
          </Typography>
          <Typography variant="detail5" color="text.secondary">
            {topDescription}
          </Typography>
        </Box>
        <Box
          sx={{
            py: '3px',
            px: '6px',
            borderRadius: '4px',
            height: 'fit-content',
            width: 'fit-content',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: `${color}.main`,
          }}
        >
          {topValue}
        </Box>
      </Box>

      <Box>{children}</Box>

      <Typography variant="detail5" color="text.secondary" textAlign="left">
        {bottomText}
      </Typography>
    </Box>
  );
};
