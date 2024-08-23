import { Trans } from '@lingui/macro';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Typography, useTheme } from '@mui/material';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

export const ReferralInforTable = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: '20px' }}>
      <Box
        sx={{
          flex: 1,
          pl: 6,
          pr: 5,
          py: 8,
          borderRadius: 4,
          bgcolor: theme.palette.background.top,
        }}
      >
        <Typography variant="h2" color="text.primary" mb={10}>
          <Trans>Your info</Trans>
        </Typography>
        <Box sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', mb: '60px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'left',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flex: 1,
              }}
            >
              <Typography variant="body3" color="text.secondary" mb="7.5px">
                <Trans>Your referral code</Trans>
                <ContentCopyIcon sx={{ width: '24px', height: '24px', ml: '4px' }} />
              </Typography>
              <Typography variant="body1" color="text.primary">
                <Trans>E24C0206B9</Trans>
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'left',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flex: 1,
              }}
            >
              <Typography variant="body3" color="text.secondary" mb="8px">
                <Trans>Recipients of your referral code</Trans>
              </Typography>
              <Typography variant="body1" color="text.primary">
                <Trans>19 People</Trans>
              </Typography>
            </Box>
          </Box>
          <Box mb="60px">
            <Typography
              variant="body1"
              sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
            >
              <VerifiedIcon
                sx={{
                  width: '24px',
                  height: '24px',
                  mr: '12px',
                  color: theme.palette.point.primary,
                }}
              />
              <Trans>Friend&apos;s referral code applied</Trans>
            </Typography>
            <Typography variant="body3" color="text.secondary">
              <Trans>You provide special referral rewards to your friends.</Trans>
            </Typography>
          </Box>
          <Box mb="43px">
            <Typography variant="body3" color="text.secondary">
              <Trans>Friend&apos;s referral code</Trans>
            </Typography>
            <Typography variant="body1" color="text.primary">
              <Trans>EDE406F0BC</Trans>
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flex: 1,
          pl: '24px',
          pr: '20px',
          pt: '32px',
          pb: '28px',
          borderRadius: '16px',
          bgcolor: theme.palette.background.top,
        }}
      >
        <Typography variant="h2" color="text.primary" mb={8}>
          <Trans>Referral reward calculator</Trans>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: '4px',
          }}
        >
          <Typography variant="body7" color="text.secondary">
            <Trans>Amount</Trans>
          </Typography>
          <Typography variant="body6" color="text.secondary">
            <Trans>Ethereum</Trans>
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.background.primary,
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: '12px',
            }}
          >
            <Typography variant="body8" color={theme.palette.text.disabled}>
              <Trans>0.0</Trans>
            </Typography>
            <Typography variant="body5" color="text.primary">
              <Trans>USDT</Trans>
            </Typography>
          </Box>
          <Box>
            <FormattedNumber
              variant="body7"
              symbolsVariant="body7"
              symbolsColor="text.mainTitle"
              symbol="USD"
              value={0}
              sx={{ color: 'text.mainTitle' }}
              visibleDecimals={2}
            />
          </Box>
        </Box>
        <Box mb="40px">
          <Typography variant="detail5" sx={{ mt: '6px', color: theme.palette.text.subTitle }}>
            <Trans>Current borrow APY</Trans>
          </Typography>
        </Box>
        <Box mb="20px">
          <Typography variant="h2" color="text.primary" mb="20px">
            <Trans>Estimated referral reward</Trans>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: '9px',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: '16px',
              py: '12px',
              bgcolor: theme.palette.background.primary,
              borderRadius: '11px',
            }}
          >
            <Typography
              variant="body6"
              sx={{
                color: theme.palette.text.disabled,
                mb: '16px',
                textAlign: 'center',
              }}
            >
              <Trans>Monthly</Trans>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '8px',
              }}
            >
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>0</Trans>
              </Typography>
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>CODE</Trans>
              </Typography>
            </Box>
            <FormattedNumber
              variant="detail2"
              symbolsVariant="detail2"
              symbolsColor={theme.palette.text.disabled}
              symbol="USD"
              value={0}
              sx={{ color: theme.palette.text.disabled }}
              visibleDecimals={2}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: '16px',
              py: '12px',
              bgcolor: theme.palette.background.primary,
              borderRadius: '11px',
            }}
          >
            <Typography
              variant="body6"
              sx={{
                color: theme.palette.text.disabled,
                mb: '16px',
                textAlign: 'center',
              }}
            >
              <Trans>Quarterly</Trans>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '8px',
              }}
            >
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>0</Trans>
              </Typography>
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>CODE</Trans>
              </Typography>
            </Box>
            <FormattedNumber
              variant="detail2"
              symbolsVariant="detail2"
              symbolsColor={theme.palette.text.disabled}
              symbol="USD"
              value={0}
              sx={{ color: theme.palette.text.disabled }}
              visibleDecimals={2}
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              px: '16px',
              py: '12px',
              bgcolor: theme.palette.background.primary,
              borderRadius: '11px',
            }}
          >
            <Typography
              variant="body6"
              sx={{
                color: theme.palette.text.disabled,
                mb: '16px',
                textAlign: 'center',
              }}
            >
              <Trans>Annually</Trans>
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: '8px',
              }}
            >
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>0</Trans>
              </Typography>
              <Typography variant="detail2" color={theme.palette.text.disabled}>
                <Trans>CODE</Trans>
              </Typography>
            </Box>
            <FormattedNumber
              variant="detail2"
              symbolsVariant="detail2"
              symbolsColor={theme.palette.text.disabled}
              symbol="USD"
              value={0}
              sx={{ color: theme.palette.text.disabled }}
              visibleDecimals={2}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
