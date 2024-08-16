import { Typography } from '@mui/material';
import { ReactNode } from 'react';

export type TxModalTitleProps = {
  title: ReactNode;
  symbol?: string;
};

export const TxModalTitle = ({ title, symbol }: TxModalTitleProps) => {
  return (
    <Typography variant="h5" sx={{ mb: 8, color: 'text.primary' }}>
      {title} {symbol ?? ''}
    </Typography>
  );
};
