import { Box, Typography } from '@mui/material';
import React, { ComponentProps, ReactNode } from 'react';

type ReserveOverviewBoxProps = {
  children: ReactNode;
  title?: ReactNode;
  fullWidth?: boolean;
  sx?: ComponentProps<typeof Box>['sx'];
};

export function ReserveOverviewBox({ title, children, sx }: ReserveOverviewBoxProps) {
  return (
    <Box
      sx={[
        {
          height: '100%',
          minWidth: 140,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {title && (
        <Typography variant="detail2" color="text.mainTitle" component="span">
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}
