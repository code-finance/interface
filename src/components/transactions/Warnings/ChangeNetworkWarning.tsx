import { ChainId } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { AlertProps, Button, Typography } from '@mui/material';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { TrackEventProps } from 'src/store/analyticsSlice';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { Warning } from '../../primitives/Warning';

export type ChangeNetworkWarningProps = AlertProps & {
  funnel?: string;
  networkName: string;
  chainId: ChainId;
  event?: TrackEventProps;
};

export const ChangeNetworkWarning = ({
  networkName,
  chainId,
  event,
  funnel,
  ...rest
}: ChangeNetworkWarningProps) => {
  const { switchNetwork, switchNetworkError } = useWeb3Context();
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleSwitchNetwork = () => {
    trackEvent(GENERAL.SWITCH_NETWORK, { funnel, ...event?.eventParams, network: networkName });
    switchNetwork(chainId);
  };
  return (
    <Warning severity="warning" {...rest}>
      {switchNetworkError ? (
        <Typography>
          <Trans>
            Seems like we can&apos;t switch the network automatically. Please check if you can
            change it from the wallet.
          </Trans>
        </Typography>
      ) : (
        <Typography variant="description">
          <Trans>Please switch to {networkName}.</Trans>{' '}
          <button
            style={{
              all: 'unset',
              cursor: 'pointer',
              marginLeft: '2px',
              verticalAlign: 'top',
              textDecoration: 'underline',
            }}
            onClick={handleSwitchNetwork}
          >
            <Trans>Switch Network</Trans>
          </button>
        </Typography>
      )}
    </Warning>
  );
};
