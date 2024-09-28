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
          py: { xs: 16, md: '100px' },
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
            <img
              alt="illustration"
              src="/Illustration.svg"
              style={{
                width: '100%',
                maxWidth: 600,
                aspectRatio: '1/1',
                marginBottom: 32,
              }}
            />
            <Typography
              sx={{ mb: { xs: 5, xsm: 10 } }}
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
            <ConnectWalletButton />
          </>
        )}
      </>
    </Paper>
  );
};
