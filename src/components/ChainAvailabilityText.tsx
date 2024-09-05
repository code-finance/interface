import { Box, BoxProps, Typography } from '@mui/material';
import { BaseNetworkConfig, networkConfigs } from 'src/ui-config/networksConfig';
import { Trans } from '@lingui/macro';
import { ChainId } from '@aave/contract-helpers';

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
  const network = networkConfigs[chainId];

  return (
    <Box
      sx={[
        { display: 'flex', alignItems: 'center', gap: 2 },
        ...(Array.isArray(wrapperSx) ? wrapperSx : [wrapperSx]),
      ]}
    >
      <Typography variant="body1" color="text.secondary">
        <Trans>Available on</Trans>
      </Typography>
      <Box
        sx={{
          height: 24,
          width: 24,
        }}
      >
        <img src={network.networkLogoPath} height="100%" width="100%" alt="Ethereum Mainnet" />
      </Box>
      <Typography variant="body1" color="text.primary">
        {networkToTextMapper(chainId, network)}
      </Typography>
    </Box>
  );
};
