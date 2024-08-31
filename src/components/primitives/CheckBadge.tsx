import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import { Box, BoxProps, Typography, TypographyProps, useTheme } from '@mui/material';
import { ReactNode } from 'react';

interface CheckBadgeProps extends BoxProps {
  checked?: boolean;
  text: ReactNode;
  variant?: TypographyProps['variant'];
  loading?: boolean;
}

export function CheckBadge({
  checked,
  text,
  variant = 'subheader2',
  loading,
  ...rest
}: CheckBadgeProps) {
  const { palette } = useTheme();
  return (
    <Box {...rest} sx={{ display: 'flex', alignItems: 'center', ...rest.sx }}>
      <Typography variant={variant} component="span" sx={{ mr: 2 }}>
        {text}
      </Typography>
      {loading ? (
        <QuestionMarkCircleIcon height={24} />
      ) : checked ? (
        <CheckOutlinedIcon height={24} sx={{ color: palette.success.main }} />
      ) : (
        <HighlightOffOutlinedIcon height={24} sx={{ color: palette.error.main }} />
      )}
    </Box>
  );
}
