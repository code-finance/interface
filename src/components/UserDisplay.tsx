import { Trans } from '@lingui/macro';
import CancelIcon from '@mui/icons-material/Cancel';
import VerifiedIcon from '@mui/icons-material/Verified';
import {
  Box,
  Button,
  FormControl,
  // FormHelperText,
  IconButton,
  InputBase,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { blo } from 'blo';
import React, { useMemo } from 'react';
import useGetEns from 'src/libs/hooks/use-get-ens';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import shallow from 'zustand/shallow';

import { Avatar, AvatarProps } from './Avatar';
import { BadgeSize, ExclamationBadge } from './badges/ExclamationBadge';
import { TextWithTooltip } from './TextWithTooltip';
import { UserNameText, UserNameTextProps } from './UserNameText';
// import { ReferralCodeToolTip } from './infoTooltips/ReferralCodeToolTip';
// import { Trans } from '@lingui/macro';

type UserDisplayProps = {
  oneLiner?: boolean;
  avatarProps?: AvatarProps;
  titleProps?: Omit<UserNameTextProps, 'address' | 'domainName'>;
  subtitleProps?: Omit<UserNameTextProps, 'address' | 'domainName'>;
  withLink?: boolean;
  funnel?: string;
  size?: number;
  checkVerify?: boolean;
};

export const UserDisplay: React.FC<UserDisplayProps> = ({
  oneLiner = false,
  avatarProps,
  titleProps,
  subtitleProps,
  withLink,
  funnel,
  size,
  checkVerify,
}) => {
  const { account, defaultDomain, domainsLoading, accountLoading } = useRootStore(
    (state) => ({
      account: state.account,
      defaultDomain: state.defaultDomain,
      domainsLoading: state.domainsLoading,
      accountLoading: state.accountLoading,
    }),
    shallow
  );
  const { readOnlyMode } = useWeb3Context();
  const fallbackImage = useMemo(
    () => (account ? blo(account as `0x${string}`) : undefined),
    [account]
  );
  const loading = domainsLoading || accountLoading;
  const theme = useTheme();
  const [value, setValue] = React.useState('');
  // handle verification when user click button
  const [verify, setVerify] = React.useState(false);
  // state for verification of user that get from api
  const [verifyAccount, setVerifyAccount] = React.useState(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const isButtonDisabled = useMemo(() => {
    if (value.length < 22) {
      return true;
    }
    const specialCharPattern = /[^a-zA-Z0-9\s]/;
    if (specialCharPattern.test(value)) {
      return true;
    }
    return false;
  }, [value]);

  const handleClick = () => {
    setVerifyAccount(true);
    return setVerify(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 0 }}>
        <Avatar
          fallbackImage={fallbackImage}
          loading={loading}
          badge={<ExclamationBadge size={size || BadgeSize.SM} />}
          invisibleBadge={!readOnlyMode}
          {...avatarProps}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', p: 0 }}>
          {!oneLiner && defaultDomain?.name ? (
            <>
              <UserNameText
                address={account}
                loading={loading}
                domainName={defaultDomain.name}
                variant="body8"
                link={withLink ? `https://etherscan.io/address/${account}` : undefined}
                funnel={funnel}
                iconSize={24}
                {...titleProps}
              />
              <UserNameText
                address={account}
                loading={loading}
                variant="body8"
                iconSize={24}
                {...subtitleProps}
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <UserNameText
                address={account}
                domainName={defaultDomain?.name}
                loading={loading}
                variant="body8"
                iconSize={24}
                link={withLink ? `https://etherscan.io/address/${account}` : undefined}
                funnel={funnel}
                {...titleProps}
              />
              {verify && (
                <TextWithTooltip
                  wrapperProps={{ ml: 2 }}
                  iconColor={theme.palette.point.primary}
                  iconSize={24}
                  icon={<VerifiedIcon />}
                >
                  <Trans>Your friend&apos;s referral code has been verified.</Trans>
                </TextWithTooltip>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {checkVerify && !verifyAccount && (
        <FormControl sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'stretch', gap: 1, mt: '12px' }}>
            <InputBase
              sx={{
                height: '45px',
                px: '6px',
                py: '10px',
                decoration: 'none',
                borderRadius: '8px',
                border: '1px solid',
                borderColor: theme.palette.border.contents,
                background: theme.palette.background.primary,
                'aria-label': 'amount input',
                fontSize: '13px !important',
                flex: 1,
                'input::placeholder': {
                  color: theme.palette.text.disabledText,
                },
              }}
              placeholder="Enter friend's referral code here."
              value={value}
              // autoFocus
              onChange={handleInputChange}
              inputProps={{
                fontFamily: 'Inter',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '130%' /* 16.9px */,
                letterSpacing: '-0.13px',
                textOverflow: 'ellipsis',
                decoration: 'none',
                style: {
                  padding: 0,
                  color: theme.palette.text.primary,
                },
              }}
              endAdornment={
                value !== '' && (
                  <IconButton
                    sx={{
                      p: 0,
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
                )
              }
            />
            <Button
              sx={{ p: '8px', borderRadius: '8px' }}
              variant="contained"
              color="primary"
              size="small"
              onClick={handleClick}
              disabled={isButtonDisabled}
            >
              <Typography variant="detail2">Regist</Typography>
            </Button>
          </Box>
          {/* <FormHelperText sx={{ display: 'flex', alignItems: 'center', mt: '12px', ml: 0 }}>
            <ReferralCodeToolTip iconSize={18} iconColor={theme.palette.point.negative} />
            <Typography variant="detail3" color={theme.palette.point.negative} ml={1}>
              <Trans>The referral code is invalid.</Trans>
            </Typography>
          </FormHelperText> */}
        </FormControl>
      )}
    </Box>
  );
};

interface ExternalUserDisplayProps {
  avatarProps?: AvatarProps;
  titleProps?: Omit<UserNameTextProps, 'address'>;
  address: string;
}

export const ExternalUserDisplay: React.FC<ExternalUserDisplayProps> = ({
  avatarProps,
  titleProps,
  address,
}) => {
  const { name, avatar } = useGetEns(address);

  const fallbackImage = useMemo(
    () => (address ? blo(address as `0x${string}`) : undefined),
    [address]
  );
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar image={avatar} fallbackImage={fallbackImage} {...avatarProps} />
      <UserNameText
        variant="h4"
        address={address}
        domainName={name}
        link={`https://etherscan.io/address/${address}`}
        iconSize={18}
        {...titleProps}
        funnel={'Delegation power panel: Governance'}
      />
    </Box>
  );
};
