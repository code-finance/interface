import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardContentNoDataProps {
  text: ReactNode;
}

export const DashboardContentNoData = ({ text }: DashboardContentNoDataProps) => {
  return (
    <Box sx={{ mt: 4, mb: 2 }}>
      <Typography color="text.buttonText" typography="body2">
        {text}
      </Typography>
    </Box>
  );
};
