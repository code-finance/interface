import { Trans } from '@lingui/macro';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Typography, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { WrapTypography } from '../../components/WrapTypography';

export const ReferralInforTable = () => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'stretch', flexWrap: 'wrap' }}>
      <BoxWrapper title={'Your info'}>
        <Box sx={{ px: 2 }}>
          <Box sx={{ display: 'flex', mb: '60px' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'left',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              <WrapTypography
                variant="body3"
                color="text.secondary"
                mb={2}
                sx={{ display: 'flex', alignItems: 'center', lineHeight: '20px' }}
              >
                <Trans>Your referral code</Trans>
                <ContentCopyIcon
                  sx={{ width: '20px', height: '20px', ml: '4px', color: 'inherit' }}
                />
              </WrapTypography>
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
                overflow: 'hidden',
              }}
            >
              <WrapTypography
                variant="body3"
                color="text.secondary"
                mb={2}
                sx={{ lineHeight: '20px' }}
              >
                <Trans>Recipients of your referral code</Trans>
              </WrapTypography>
              <Typography variant="body1" color="text.primary">
                <Trans>19 People</Trans>
              </Typography>
            </Box>
          </Box>
          <Box mb="60px">
            <Typography
              variant="body1"
              sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}
              mb={2}
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
            <Typography
              variant="body3"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Trans>You have a preferred interest rate benefit.</Trans>
              <ContentCopyIcon sx={{ width: '20px', height: '20px', ml: 1, color: 'inherit' }} />
            </Typography>
          </Box>
          <Box>
            <Typography variant="body3" color="text.secondary" mb={2} component="div">
              <Trans>Friend&apos;s referral code</Trans>
            </Typography>
            <Typography variant="body1" color="text.primary">
              <Trans>EDE406F0BC</Trans>
            </Typography>
          </Box>
        </Box>
      </BoxWrapper>
      <BoxWrapper title={'Referral reward calculator'}>
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
            gap: 2,
          }}
        >
          <EstimateReward title={'Monthly'} />
          <EstimateReward title={'Quarterly'} />
          <EstimateReward title={'Annually'} />
        </Box>
      </BoxWrapper>
    </Box>
  );
};

type BoxWrapper = {
  title: string;
};
const BoxWrapper = ({ children, title }: PropsWithChildren<BoxWrapper>) => {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        py: 7,
        px: 6,
        borderRadius: 4,
        backgroundColor: theme.palette.background.top,
        minWidth: '430px',
      })}
    >
      <Typography variant="h2" color="text.primary" mb={10}>
        <Trans>{title}</Trans>
      </Typography>
      {children}
    </Box>
  );
};

type EstimateRewardType = {
  title: string;
};
const EstimateReward = ({ title }: EstimateRewardType) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 4,
        py: 3,
        backgroundColor: theme.palette.background.primary,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="body6"
        color="text.mainTitle"
        component="div"
        sx={{
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Trans>{title}</Trans>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="detail2" color="text.mainTitle">
          <Trans>0</Trans>
        </Typography>
        <Typography variant="detail2" color="text.mainTitle">
          <Trans>CODE</Trans>
        </Typography>
      </Box>
      <FormattedNumber
        variant="detail2"
        symbolsVariant="detail2"
        symbolsColor="text.mainTitle"
        color="text.mainTitle"
        symbol="USD"
        value={0}
        visibleDecimals={2}
      />
    </Box>
  );
};
