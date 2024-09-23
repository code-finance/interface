import { Trans } from '@lingui/macro';
import { Box, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { displayGhoForMintableMarket } from 'src/utils/ghoUtilities';

type ReserveConfigurationProps = {
  reserve: ComputedReserveData;
};

const ReserveConfiguration = dynamic(() =>
  import('./ReserveConfiguration').then((module) => module.ReserveConfiguration)
);

export const ReserveConfigurationWrapper: React.FC<ReserveConfigurationProps> = ({ reserve }) => {
  const xsm = useMediaQuery(useTheme().breakpoints.up('xsm'));
  return (
    <Paper
      variant="elevation"
      sx={{
        py: 9,
        px: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          mb:
            reserve.isFrozen || reserve.symbol == 'AMPL' || reserve.symbol === 'stETH'
              ? '0px'
              : '28px',
        }}
      >
        <Typography variant={'h2'} color="text.primary">
          <Trans>Reserve status &#38; configuration</Trans>
        </Typography>
      </Box>

      <ReserveConfiguration reserve={reserve} />
    </Paper>
  );
};
