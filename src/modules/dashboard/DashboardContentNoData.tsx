import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface DashboardContentNoDataProps {
  text: ReactNode;
}

export const DashboardContentNoData = ({ text }: DashboardContentNoDataProps) => {
  return (
    <Box sx={{ pt: { xs: 2, xsm: 3 } }}>
      <Typography color="text.secondary">{text}</Typography>
    </Box>
  );
};
