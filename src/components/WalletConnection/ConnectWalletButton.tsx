import { Trans } from '@lingui/macro';
import { BoxProps, Button, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

const WalletModal = dynamic(() => import('./WalletModal').then((module) => module.WalletModal));

export interface ConnectWalletProps {
  funnel?: string;
  isSwitchWallet?: boolean;
  wrapperSx?: BoxProps['sx'];
}

export const ConnectWalletButton: React.FC<ConnectWalletProps> = ({
  funnel,
  isSwitchWallet,
  wrapperSx,
}) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Button
        sx={{ height: '45px', width: '234px', ...wrapperSx }}
        size="medium"
        variant="outlined"
        onClick={() => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          setWalletModalOpen(true);
        }}
      >
        {isSwitchWallet ? (
          <Typography variant="body7">
            <Trans>Switch wallet</Trans>
          </Typography>
        ) : (
          <Typography variant="body7">
            <Trans>Connect wallet</Trans>
          </Typography>
        )}
      </Button>
      <WalletModal />
    </>
  );
};
