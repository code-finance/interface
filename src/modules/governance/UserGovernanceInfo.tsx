import { Trans } from '@lingui/macro';
import { Typography } from '@mui/material';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from 'src/store/root';

import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';
import { ListWrapper } from '../../components/lists/ListWrapper';

export const UserGovernanceInfo = () => {
  const account = useRootStore((state) => state.account);

  return (
    <ListWrapper
      localStorageName={'userGovernanceInfo'}
      noData={!!account}
      collapsedSx={(theme) => ({ color: theme.palette.text.buttonText })}
      titleComponent={
        <Typography variant="h2" color="text.buttonText" sx={{ mb: { xs: 2, xsm: 4 } }}>
          <Trans>Your supplies</Trans>
        </Typography>
      }
      paperSx={(theme) => ({ px: 6, py: 7, background: theme.palette.background.group })}
    >
      {account ? (
        <VotingPowerInfoPanel />
      ) : (
        <>
          <Typography sx={{ mb: 7 }} color="text.buttonText" variant="body2">
            <Trans>Please connect a wallet to view your personal information here.</Trans>
          </Typography>
          <ConnectWalletButton funnel="Governance Page" />
        </>
      )}
    </ListWrapper>
  );
};
