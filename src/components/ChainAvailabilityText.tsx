import { Box, BoxProps, Typography } from '@mui/material';

type ChainAvailabilityTextProps = {
  title: string;
  wrapperSx: BoxProps['sx'];
};

export const ChainAvailabilityText = ({ wrapperSx, title }: ChainAvailabilityTextProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...wrapperSx }}>
      <img width="48px" height="48px" src={'/icons/networks/ethereum.svg'} alt="demo" />
      <Typography variant="h1" sx={{ ml: 2, color: 'text.primary' }}>
        CODE {title}
      </Typography>
    </Box>
  );
};
