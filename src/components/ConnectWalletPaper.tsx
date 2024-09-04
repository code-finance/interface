import { Trans } from '@lingui/macro';
import { CircularProgress, Paper, PaperProps, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';

import { ConnectWalletButton } from './WalletConnection/ConnectWalletButton';

interface ConnectWalletPaperProps extends PaperProps {
  loading?: boolean;
  description?: ReactNode;
}

export const ConnectWalletPaper = ({ loading, description, ...rest }: ConnectWalletPaperProps) => {
  return (
    <Paper
      {...rest}
      sx={[
        (theme) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 4,
          py: '100px',
          flex: 1,
          borderRadius: 4,
          background: theme.palette.background.primary,
        }),
      ]}
    >
      <>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Box
              sx={(theme) => ({
                width: '100%',
                maxWidth: 600,
                aspectRatio: '1/1',
                backgroundColor: theme.palette.background.secondary,
                mb: 8,
              })}
            />
            <Typography sx={{ mb: 10, fontSize: 20, fontWeight: 500 }} color="text.secondary">
              {description || (
                <Trans>
                  Please connect your wallet to see your supplies, borrowings, and open positions.
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
