import { Trans } from '@lingui/macro';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useRootStore } from 'src/store/root';

import { VotingPowerInfoPanel } from './VotingPowerInfoPanel';
import { ListWrapper } from '../../components/lists/ListWrapper';

export const UserGovernanceInfo = () => {
  const account = useRootStore((state) => state.account);
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
    <ListWrapper
      localStorageName={'userGovernanceInfo'}
      noData={!!account}
      collapsedSx={(theme) => ({ color: theme.palette.text.buttonText })}
      titleComponent={
        <Typography
          variant={xsm ? 'h2' : 'h3'}
          color="text.buttonText"
          sx={{ mb: { xs: 0, xsm: 4 } }}
        >
          <Trans>Your supplies</Trans>
        </Typography>
      }
      paperSx={(theme) => ({
        py: { xs: 4, sxm: 9 },
        px: 4,
        background: theme.palette.background.group,
      })}
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
