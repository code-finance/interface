import { Trans } from '@lingui/macro';
import { Button } from '@mui/material';
import dynamic from 'next/dynamic';
import { useWalletModalContext } from 'src/hooks/useWalletModal';
import { useRootStore } from 'src/store/root';
import { AUTH } from 'src/utils/mixPanelEvents';

const WalletModal = dynamic(() => import('./WalletModal').then((module) => module.WalletModal));

export interface ConnectWalletProps {
  funnel?: string;
  isSwitchWallet?: boolean;
}

export const ConnectWalletButton: React.FC<ConnectWalletProps> = ({ funnel, isSwitchWallet }) => {
  const { setWalletModalOpen } = useWalletModalContext();
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <>
      <Button
        sx={{ px: 15, py: 3 }}
        variant="outlined"
        onClick={() => {
          trackEvent(AUTH.CONNECT_WALLET, { funnel: funnel });
          setWalletModalOpen(true);
        }}
      >
        {isSwitchWallet ? <Trans>Switch wallet</Trans> : <Trans>Connect wallet</Trans>}
      </Button>
      <WalletModal />
    </>
  );
};
