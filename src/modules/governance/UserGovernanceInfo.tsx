import { Trans } from '@lingui/macro';
import { Paper, Typography } from '@mui/material';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from 'src/store/root';

import { DelegatedInfoPanel } from './DelegatedInfoPanel';
import { RepresentativesInfoPanel } from './RepresentativesInfoPanel';
import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';

export const UserGovernanceInfo = () => {
  const account = useRootStore((state) => state.account);

  return account ? (
    <>
      <VotingPowerInfoPanel />
      {/*<DelegatedInfoPanel />*/}
      {/*<RepresentativesInfoPanel />*/}
    </>
  ) : (
    <Paper sx={(theme) => ({ px: 6, py: 7, background: theme.palette.background.group })}>
      <Typography variant="h3" color="text.buttonText" sx={{ mb: { xs: 2, xsm: 4 } }}>
        <Trans>Your supplies</Trans>
      </Typography>
      <Typography sx={{ mb: 7 }} color="text.buttonText" variant="body2">
        <Trans>Please connect a wallet to view your personal information here.</Trans>
      </Typography>
      <ConnectWalletButton funnel="Governance Page" />
    </Paper>
  );
};
