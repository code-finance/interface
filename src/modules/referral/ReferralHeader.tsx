import { Trans } from '@lingui/macro';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';

export const ReferralHeader = () => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
    <TopInfoPanel
      titleComponent={
        <Box>
          <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
            <img width="48px" height="48px" src={'/icons/networks/ethereum.svg'} />
            <Typography variant={'h1'} sx={{ ml: 2, color: 'text.primary' }}>
              <Trans>Referral Program</Trans>
            </Typography>
          </Box>
          <Box>
            <Typography
              variant={xsm ? 'body3' : 'description'}
              color="text.secondary"
              sx={{ maxWidth: '1260px' }}
            >
              <Trans>
                Participants in Code&apos;s referral program can receive special rewards. When
                someone who used their referral code completes a repayment, they are rewarded with a
                portion of the protocol fees.
              </Trans>
            </Typography>
          </Box>
        </Box>
      }
    />
  );
};
