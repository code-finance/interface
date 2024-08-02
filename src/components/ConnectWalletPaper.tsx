import { Trans } from '@lingui/macro';
import { CircularProgress, Paper, PaperProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
}

export const ConnectWalletPaper = ({
  loading,
  description,
  sx,
  ...rest
}: ConnectWalletPaperProps) => {
  return (
    <Paper
      {...rest}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
        borderRadius: 4,
        background: theme.palette.background.secondary,
        ...sx,
      })}
    >
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography sx={{ mb: 10, fontSize: 20 }} color="text.secondary">
              {description || (
                <Trans>
                  We couldn’t detect a wallet. Connect a wallet to stake and view your balance.
                </Trans>
              )}
            </Typography>
            <ConnectWalletButton />
          </>
        )}
      </>
    </Paper>
  );
};
