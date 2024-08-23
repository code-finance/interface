import { Trans } from '@lingui/macro';
import { CircularProgress, Paper, PaperProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperReferralProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
  titleHeader?: ReactNode;
  isSwitchWallet?: boolean;
}

export const ConnectWalletPaperReferral = ({
  loading,
  title,
  description,
  isSwitchWallet,
  sx,
  titleHeader,
  ...rest
}: ConnectWalletPaperReferralProps) => {
  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 5,
        py: 25,
        flex: 1,
        ...sx,
      }}
    >
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 8 }} color={'text.primary'}>
              <Trans>{titleHeader}</Trans>
            </Typography>
            <Typography
              sx={{ mb: 10, fontSize: '20px', fontWeight: 500, lineHeight: '130%' }}
              color="text.secondary"
            >
              {description}
            </Typography>
            <ConnectWalletButton isSwitchWallet={isSwitchWallet} funnel={'Referral page'} />
          </>
        )}
      </>
    </Paper>
  );
};
