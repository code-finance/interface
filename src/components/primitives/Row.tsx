import { Box, BoxProps, Typography } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

interface RowProps extends BoxProps {
  caption?: ReactNode;
  captionVariant?: ComponentProps<typeof Typography>['variant'];
  captionColor?: string;
  align?: 'center' | 'flex-start';
}

export const Row = ({
  caption,
  children,
  captionVariant = 'secondary16',
  captionColor,
  align = 'center',
  ...rest
}: RowProps) => {
  return (
    <Box
      {...rest}
      sx={{ display: 'flex', alignItems: align, justifyContent: 'space-between', ...rest.sx }}
    >
      {caption && (
        <Typography component="div" variant={captionVariant} color={captionColor} sx={{ mr: 2 }}>
          {caption}
        </Typography>
      )}

      {children}
    </Box>
  );
};
