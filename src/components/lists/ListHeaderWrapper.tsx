import { Box, BoxProps } from '@mui/material';
import { ReactNode } from 'react';

interface ListHeaderWrapperProps extends BoxProps {
  px?: number;
  children: ReactNode;
}

export const ListHeaderWrapper = ({ px = 0, children, ...rest }: ListHeaderWrapperProps) => {
  return (
    <Box
      {...rest}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        px,
        py: 4,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...rest.sx,
        bgcolor: 'background.primary',
      }}
    >
      {children}
    </Box>
  );
};
