import { Trans } from '@lingui/macro';
import { Box, BoxProps, Typography } from '@mui/material';

type ChainAvailabilityTextProps = {
  page: string;
  wrapperSx: BoxProps['sx'];
};

export const ChainAvailabilityText: React.FC<ChainAvailabilityTextProps> = ({
  wrapperSx,
  page,
}) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...wrapperSx }}>
      <img src={'/icons/ethereum.svg'} style={{ width: 48, height: 48 }} alt="icon" />
      <Typography variant="h1" sx={{ ml: 2, color: 'text.primary', lineHeight: 1 }}>
        <Trans>CODE {page}</Trans>
      </Typography>
    </Box>
  );
};
