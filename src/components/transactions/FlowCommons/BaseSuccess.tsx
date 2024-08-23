import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Link, SvgIcon, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';
import { useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';

export type BaseSuccessTxViewProps = {
  txHash?: string;
  children: ReactNode;
  hideTx?: boolean;
};

const ExtLinkIcon = () => (
  <SvgIcon sx={{ ml: '2px', fontSize: '11px' }}>
    <ExternalLinkIcon />
  </SvgIcon>
);

export const BaseSuccessView = ({ txHash, children, hideTx }: BaseSuccessTxViewProps) => {
  const { close, mainTxState } = useModalContext();
  const { currentNetworkConfig } = useProtocolDataContext();
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 3,
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '48px',
            height: '48px',
            bgcolor: 'success.200',
            borderRadius: '50%',
            mt: 14,
            mx: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgIcon sx={(theme) => ({ color: theme.palette.point.positive, fontSize: '60px' })}>
            <CheckCircleIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 5, mb: 2 }} variant="body1" color="title.primary">
          <Trans>All done!</Trans>
        </Typography>

        {children}
      </Box>

      {!hideTx && (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            component={Link}
            variant="outlined"
            href={currentNetworkConfig.explorerLinkBuilder({
              tx: txHash ? txHash : mainTxState.txHash,
            })}
            sx={{
              color: theme.palette.text.subTitle,
              p: '3px 4px 3px 8px',
              borderRadius: '4px',
              ...theme.typography.detail2,
              border: `1px solid ${theme.palette.border.contents}`,
              height: '24px',
              width: 146,
              ml: 'auto',
            }}
            underline="hover"
            target="_blank"
            rel="noreferrer noopener"
          >
            <Trans>Review tx details</Trans>
            <CallMadeOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
          </Button>
          <Button
            onClick={close}
            variant="contained"
            size="large"
            sx={{ height: '45px', mt: 12 }}
            data-cy="closeButton"
          >
            <Trans>Ok, Close</Trans>
          </Button>
        </Box>
      )}
    </>
  );
};
