import { DuplicateIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Link, SvgIcon, Typography, useTheme } from '@mui/material';
import { useModalContext } from 'src/hooks/useModal';
import { TxErrorType } from 'src/ui-config/errorMapping';

export const TxErrorView = ({ txError }: { txError: TxErrorType }) => {
  const { close } = useModalContext();
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '48px',
            height: '48px',
            backgroundColor: 'error.200',
            borderRadius: '50%',
            mt: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgIcon sx={{ color: 'error.main', fontSize: '60px' }}>
            <CancelIcon />
          </SvgIcon>
        </Box>

        <Typography sx={{ mt: 5, mb: 2 }} variant="body1" color="text.primary" component="div">
          <Trans>Transaction failed</Trans>
        </Typography>

        <Typography variant="body5" sx={{ color: 'text.secondary', px: 10, textAlign: 'center' }}>
          <Trans>
            You can report incident to our{' '}
            <Link color="text.secondary" href="https://discord.com/invite/aave">
              Discord
            </Link>{' '}
            or{' '}
            <Link color="text.secondary" href="https://github.com/aave/interface">
              Github
            </Link>
            .
          </Trans>
        </Typography>

        <Button
          variant="outlined"
          onClick={() => navigator.clipboard.writeText(txError.rawError.message.toString())}
          size="small"
          sx={{
            mt: 4,
            color: theme.palette.text.subTitle,
            p: '3px 4px 3px 8px',
            borderRadius: '4px',
            ...theme.typography.detail2,
            border: `1px solid ${theme.palette.border.contents}`,
            height: '24px',
          }}
        >
          <Typography variant="detail2" sx={{ textTransform: 'uppercase' }}>
            <Trans>Copy error text</Trans>
          </Typography>

          <SvgIcon sx={{ ml: 0.5, fontSize: '12px' }}>
            <DuplicateIcon />
          </SvgIcon>
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', mt: 12 }}>
        <Button onClick={close} variant="contained" size="large" sx={{ height: '45px' }}>
          <Trans>Close</Trans>
        </Button>
      </Box>
    </>
  );
};
