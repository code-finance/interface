import { Trans } from '@lingui/macro';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  IconButton,
  InputBase,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { PropsWithChildren } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { WrapTypography } from '../../components/WrapTypography';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { ReferralCodeToolTip } from 'src/components/infoTooltips/ReferralCodeToolTip';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { NumberFormatCustom } from 'src/components/transactions/AssetInput';
import { useQuery } from '@tanstack/react-query';
import { getReferralList } from 'src/utils/referral';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useReferral } from 'src/libs/hooks/useReferral';

export const ReferralInforTable = () => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  const { currentAccount } = useWeb3Context();

  const { data: referralListRes } = useQuery({
    queryKey: [`/api/referral/list/${currentAccount}`],
    queryFn: () => getReferralList(currentAccount),
  });

  const { referralData } = useReferral();
  const referralListData = referralListRes?.data?.data || [];

  const [network, setNetwork] = React.useState('Ethereum');
  const [coins, setCoins] = React.useState('USDT');
  const [apy, setApy] = React.useState(0.0461);
  const [usd, setUsd] = React.useState(1.0);
  const [value, setValue] = React.useState('');
  const menuItems = [
    { value: 'Ethereum', label: 'Ethereum' },
    { value: 'Kaia', label: 'Kaia' },
    { value: 'TON', label: 'TON' },
    { value: 'Solana', label: 'Solana' },
  ];
  const menuCoins = [
    { value: 'USDT', label: 'USDT', apy: 0.0461, usd: 1.0 },
    { value: 'sDAI', label: 'sDAI', apy: 0.0561, usd: 1.11 },
    { value: 'USDe', label: 'USDe', apy: 0.0361, usd: 0.9994 },
    { value: 'WBTC', label: 'WBTC', apy: 0.0661, usd: 65125.7 },
  ];

  const handleCopyReferralCode = async () => {
    navigator.clipboard.writeText(referralData.myCode || '');
  };

  return (
    <Box sx={{ display: 'flex', gap: '20px', alignItems: 'stretch', flexWrap: 'wrap' }}>
      <BoxWrapper title={'Your info'}>
        <Box sx={{ px: 2 }}>
          <Box
            sx={{
              display: 'flex',
              mb: xsm ? '60px' : '20px',
              flexDirection: xsm ? 'row' : 'column',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'left',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                flex: 1,
                overflow: 'hidden',
                mb: xsm ? 0 : '20px',
              }}
            >
              <WrapTypography
                variant={xsm ? 'body3' : 'body7'}
                color="text.secondary"
                mb={xsm ? 2 : 1}
                sx={{ display: 'flex', alignItems: 'center', lineHeight: '20px' }}
              >
                <Trans>Your referral code</Trans>
                <Box sx={{ ml: '4px', cursor: 'pointer' }} onClick={handleCopyReferralCode}>
                  <ContentCopyIcon sx={{ width: '20px', height: '20px', color: 'inherit' }} />
                </Box>
              </WrapTypography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CompactableTypography
                  color="text.primary"
                  variant={xsm ? 'body1' : 'body2'}
                  compactMode={CompactMode.SM}
                  compact
                >
                  {referralData.myCode || ''}
                </CompactableTypography>
                <ReferralCodeToolTip
                  iconSize={xsm ? 18 : 16}
                  iconColor="text.primary"
                  iconMargin={4}
                  code={referralData.myCode || ''}
                />
              </Box>
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
                variant={xsm ? 'body3' : 'body7'}
                color="text.secondary"
                mb={xsm ? 2 : 1}
                sx={{ lineHeight: '20px' }}
              >
                <Trans>Recipients of your referral code</Trans>
              </WrapTypography>
              <Typography variant={xsm ? 'body1' : 'body2'} color="text.primary">
                <Trans>{referralListData.length} People</Trans>
              </Typography>
            </Box>
          </Box>
          <Box mb={xsm ? '60px' : '20px'}>
            <Typography
              variant={xsm ? 'body1' : 'body3'}
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
              }}
              mb={xsm ? 2 : 1}
            >
              <VerifiedIcon
                sx={{
                  width: '24px',
                  height: '24px',
                  mr: xsm ? '12px' : '4px',
                  color: theme.palette.point.primary,
                }}
              />
              <Trans>Friend&apos;s referral code applied</Trans>
            </Typography>
            <Typography
              variant={xsm ? 'body3' : 'detail3'}
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Trans>You provide special referral rewards to your friends.</Trans>
              {/* <ContentCopyIcon sx={{ width: '20px', height: '20px', ml: 1, color: 'inherit' }} /> */}
            </Typography>
          </Box>

          {referralData.myReferral ? (
            <Box>
              <Typography
                variant={xsm ? 'body3' : 'body7'}
                color="text.secondary"
                mb={xsm ? 2 : 1}
                component="div"
              >
                <Trans>Friend&apos;s referral code</Trans>
              </Typography>
              <Typography
                sx={{ display: 'flex', alignItems: 'center' }}
                variant={xsm ? 'body1' : 'body2'}
                color="text.primary"
              >
                <Trans>{referralData.myReferral}</Trans>
                <TextWithTooltip iconSize={18} iconColor="text.primary" iconMargin={4}>
                  <Trans>{referralData.myReferral}</Trans>
                </TextWithTooltip>
              </Typography>
            </Box>
          ) : null}
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
            <TextField
              select
              value={network}
              onChange={(e) => setNetwork(e.target.value as string)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                  p: '0 !important',
                },
                '& .MuiSelect-select.MuiSelect-outlined': {
                  overflow: 'visible !important',
                  '&.Mui-disabled': {
                    '-webkit-text-fill-color': 'unset',
                  },
                  pl: 0,
                  pr: '26px',
                },
              }}
              variant="outlined"
            >
              {menuItems.map(({ value, label }) => (
                <MenuItem sx={{ p: '12px', width: '160px' }} key={value} value={value}>
                  <img width="24px" height="24px" src={'/icons/networks/ethereum.svg'} />{' '}
                  <Typography
                    variant={value === network ? 'body6' : 'body7'}
                    color={value === network ? 'text.secondary' : 'text.primary'}
                    ml={1}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Typography>
        </Box>
        <Box
          sx={{
            bgcolor: theme.palette.background.primary,
            borderRadius: '8px',
            padding: xsm ? '16px' : '8px',
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
            <InputBase
              sx={{
                flex: 1,
                'input::placeholder': {
                  color: theme.palette.text.disabledText,
                },
              }}
              placeholder="0.00"
              value={value}
              autoFocus
              onChange={(e) => setValue(e.target.value)}
              inputProps={{
                'aria-label': 'amount input',
                style: {
                  textOverflow: 'ellipsis',
                  padding: 0,
                  ...theme.typography.body8,
                  color: theme.palette.text.primary,
                },
              }}
              // eslint-disable-next-line
              inputComponent={NumberFormatCustom as any}
            />
            {value !== '' && (
              <IconButton
                sx={{
                  minWidth: 0,
                  color: 'text.subText',
                  '&:hover': {
                    color: 'text.disabledBg',
                  },
                }}
                onClick={() => {
                  setValue('');
                }}
              >
                <CancelIcon height={24} width={24} />
              </IconButton>
            )}
            <TextField
              select
              value={coins}
              onChange={(e) => {
                setCoins(e.target.value as string);
                setApy(menuCoins.find((item) => item.value === e.target.value)?.apy || 0);
                setUsd(menuCoins.find((item) => item.value === e.target.value)?.usd || 0);
              }}
              size="small"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                },
                '& .MuiSelect-select.MuiSelect-outlined': {
                  overflow: 'visible !important',
                  '&.Mui-disabled': {
                    '-webkit-text-fill-color': 'unset',
                  },
                  pl: 0,
                  pr: '26px',
                },
              }}
              SelectProps={{
                MenuProps: {
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  PaperProps: {
                    sx: (theme) => ({
                      ml: '10px',
                      overflowY: 'auto',
                      borderRadius: '8px',
                      backgroundColor: theme.palette.background.secondary,
                      border: `1px solid ${theme.palette.border.contents}`,
                      boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)',
                    }),
                    style: {
                      minWidth: 160,
                    },
                    variant: 'outlined',
                    elevation: 0,
                  },
                },
              }}
              variant="outlined"
            >
              {menuCoins.map(({ value, label }) => (
                <MenuItem sx={{ p: '12px' }} key={value} value={value}>
                  <img width="24px" height="24px" src={'/icons/networks/ethereum.svg'} alt={''} />{' '}
                  <Typography
                    variant={value === coins ? (xsm ? 'body5' : 'body3') : 'body7'}
                    color="text.primary"
                    ml={1}
                  >
                    {label}
                  </Typography>
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box>
            <FormattedNumber
              variant="body7"
              symbolsVariant="body7"
              symbolsColor="text.mainTitle"
              symbol="USD"
              value={(Number(value) * usd).toFixed(4)}
              sx={{ color: 'text.mainTitle' }}
              visibleDecimals={2}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: '40px',
            mt: '6px',
          }}
        >
          <Typography variant="detail5" sx={{ color: theme.palette.text.subTitle }}>
            <Trans>Current borrow APY</Trans>
          </Typography>
          <FormattedNumber
            variant="detail5"
            symbolsVariant="detail5"
            symbolsColor="text.subTitle"
            color="text.subTitle"
            percent
            value={0}
            visibleDecimals={2}
          />
        </Box>
        <Box mb="20px">
          <Typography variant={'h2'} color="text.primary" mb="20px">
            <Trans>Estimated referral reward</Trans>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <EstimateReward
            coins={coins}
            apy={apy}
            value={Number(value)}
            usd={usd}
            title={'Monthly'}
          />
          <EstimateReward
            coins={coins}
            apy={apy}
            value={Number(value)}
            usd={usd}
            title={'Quarterly'}
          />
          <EstimateReward
            coins={coins}
            apy={apy}
            value={Number(value)}
            usd={usd}
            title={'Annually'}
          />
        </Box>
      </BoxWrapper>
    </Box>
  );
};

type BoxWrapper = {
  title: string;
};
const BoxWrapper = ({ children, title }: PropsWithChildren<BoxWrapper>) => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        py: xsm ? '28px' : '16px',
        px: xsm ? '24px' : '16px',
        width: '100%',
        borderRadius: 4,
        backgroundColor: theme.palette.background.top,
      })}
    >
      <Typography variant={'h2'} color="text.primary" mb={xsm ? 10 : 5}>
        <Trans>{title}</Trans>
      </Typography>
      {children}
    </Box>
  );
};

type EstimateRewardType = {
  title: string;
  coins: string;
  apy: number;
  value: number;
  usd: number;
};
const EstimateReward = ({ title, coins, apy, value, usd }: EstimateRewardType) => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  const total =
    title === 'Monthly'
      ? (((value * apy) / 365) * 30 * 0.2).toFixed(4)
      : title === 'Quarterly'
      ? (((value * apy) / 365) * 90 * 0.2).toFixed(4)
      : (value * apy * 0.2).toFixed(4);
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
        variant={xsm ? 'body6' : 'body7'}
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
        <FormattedNumber
          variant="detail2"
          symbolsVariant="detail2"
          symbolsColor="text.mainTitle"
          color="text.mainTitle"
          value={total}
          visibleDecimals={4}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img width="18px" height="18px" src={'/icons/networks/ethereum.svg'} />{' '}
          <Typography variant={xsm ? 'detail2' : 'caption'} color="text.mainTitle" ml="2px">
            <Trans>{coins}</Trans>
          </Typography>
        </Box>
      </Box>
      <FormattedNumber
        variant="detail2"
        symbolsVariant="detail2"
        symbolsColor="text.mainTitle"
        color="text.mainTitle"
        symbol="USD"
        value={Number(total) * usd}
        visibleDecimals={4}
      />
    </Box>
  );
};
