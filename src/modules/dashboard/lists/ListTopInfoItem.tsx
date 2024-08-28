import { Paper, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import { FormattedNumber } from '../../../components/primitives/FormattedNumber';

interface ListTopInfoItemProps {
  title: ReactNode;
  value: number | string;
  percent?: boolean;
  tooltip?: ReactNode;
}

export const ListTopInfoItem = ({ title, value, percent, tooltip }: ListTopInfoItemProps) => {
  const theme = useTheme();
  return (
    <Paper
      variant="outlined"
      sx={{
        mr: 2,
        borderRadius: '4px',
        color: theme.palette.text.buttonText,
        border: 'none',
        p: '3px 4px',
        display: 'flex',
        alignItems: 'center',
        boxShadow: 'none',
        bgcolor: theme.palette.background.chip,
      }}
    >
      <Typography variant="detail2" color={theme.palette.text.buttonText} sx={{ mr: 1 }} noWrap>
        {title}
      </Typography>
      <FormattedNumber
        symbolsColor="text.buttonText"
        value={value}
        percent={percent}
        variant="detail2"
        symbolsVariant="detail2"
        color="text.buttonText"
        symbol="USD"
      />

      {tooltip}
    </Paper>
  );
};
