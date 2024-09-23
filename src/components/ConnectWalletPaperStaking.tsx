import { Trans } from '@lingui/macro';
import { Box, CircularProgress, Grid, Paper, PaperProps, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { StakingPanelNoWallet } from 'src/modules/staking/StakingPanelNoWallet';

import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperStakingProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
}

export const ConnectWalletPaperStaking = ({
  loading,
  description,
  sx,
  ...rest
}: ConnectWalletPaperStakingProps) => {
  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: '20px',
        py: '60px',
        flex: 1,
        ...sx,
      }}
    >
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Box mb={'40px'}>
              <Typography
                variant="h6"
                sx={{ mb: { xs: 5, xsm: 8 }, maxWidth: 296 }}
                color={'text.primary'}
              >
                <Trans>Please,</Trans>
                <br />
                <Trans>connect your wallet</Trans>
              </Typography>
              <Typography
                sx={{ mb: { xs: 5, xsm: 10, maxWidth: 280 } }}
                color="text.secondary"
                variant="body8"
                component="div"
              >
                {description || (
                  <Trans>
                    Please connect your wallet to see your supplies, borrowings, and open positions.
                  </Trans>
                )}
              </Typography>
              <ConnectWalletButton funnel={'Staking page'} />
            </Box>
            <Box
              sx={{
                width: '100%',
                textAlign: 'right',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', xsm: 'row' },
                display: 'flex',
                gap: { xs: 2, xsm: 3 },
              }}
            >
              {/* <StakingPanelNoWallet stakedToken={'GHO'} icon={'gho'} /> */}
              <Box sx={{ flex: 1 }}>
                <StakingPanelNoWallet stakedToken={'AAVE'} icon={'/icons/networks/ethereum.svg'} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <StakingPanelNoWallet
                  stakedToken={'AAVE'}
                  icon={'/icons/networks/kaia.svg'}
                  networkName="Kaia"
                />
              </Box>
            </Box>
          </>
        )}
      </>
    </Paper>
  );
};
