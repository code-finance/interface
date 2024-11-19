import { Box, BoxProps, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BaseNetworkConfig, networkConfigs } from 'src/ui-config/networksConfig';
import { Trans } from '@lingui/macro';
import { ChainId } from '@aave/contract-helpers';

type ChainAvailabilityTextProps = {
  title: string;
  wrapperSx: BoxProps['sx'];
};

export const ChainAvailabilityText = ({ wrapperSx, title }: ChainAvailabilityTextProps) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...wrapperSx }}>
      <img
        width={md ? 44 : 28}
        height={md ? 44 : 28}
        src={'/icons/networks/ethereum.svg'}
        alt="demo"
      />
      <Typography variant={'h1'} sx={{ ml: 2, color: 'text.primary' }} component="h1">
        CODE {title}
      </Typography>
    </Box>
  );
};

type ChainAvailabilityTextProps2 = {
  chainId: ChainId;
  wrapperSx?: BoxProps['sx'];
};

const networkToTextMapper = (chainId: ChainId, networkConfig: BaseNetworkConfig) => {
  switch (chainId) {
    case ChainId.mainnet:
      return 'Ethereum Mainnet';
    default:
      return networkConfig.name;
  }
};

export const ChainAvailabilityText2: React.FC<ChainAvailabilityTextProps2> = ({
  chainId,
  wrapperSx,
}) => {
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up('md'));
  const network = networkConfigs[chainId];

  return (
    <Box
      sx={[
        { display: 'flex', alignItems: 'center', gap: 2 },
        ...(Array.isArray(wrapperSx) ? wrapperSx : [wrapperSx]),
      ]}
    >
      <Typography variant={md ? 'body1' : 'body2'} color="text.secondary">
        <Trans>Available on</Trans>
      </Typography>
      <Box
        sx={{
          height: md ? 24 : 20,
          width: md ? 24 : 20,
        }}
      >
        <img src={network.networkLogoPath} height="100%" width="100%" alt="Ethereum Mainnet" />
      </Box>
      <Typography variant={md ? 'body1' : 'body2'} color="text.primary">
        {networkToTextMapper(chainId, network)}
      </Typography>
    </Box>
  );
};
