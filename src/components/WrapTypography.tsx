import { styled, Typography } from '@mui/material';

export const WrapTypography = styled(Typography)({
  overflow: 'hidden',
  width: '100%',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}) as typeof Typography;
