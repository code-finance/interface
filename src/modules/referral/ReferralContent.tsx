import { Trans } from '@lingui/macro';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ConnectWalletPaperReferral } from 'src/components/ConnectWalletPaperReferral';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { StatusListHeader } from './StatusListHeader';

export const ReferralContent = () => {
  const { currentAccount, loading } = useWeb3Context();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const theme = useTheme();
  const isValidNetWorkWallet = true;
  const [searchTerm, setSearchTerm] = useState<string>('');
  return (
    <Box sx={{ mt: '40px', mx: '148px', mb: '189px' }}>
      {currentAccount && !loading ? (
        isValidNetWorkWallet ? (
          <Container sx={{ px: '0 !important' }}>
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
                    <Typography variant="body7" color={theme.palette.text.mainTitle}>
                      <Trans>$0</Trans>
                    </Typography>
                  </Box>
                </Box>
                <Box mb="40px">
                  <Typography
                    variant="detail5"
                    sx={{ mt: '6px', color: theme.palette.text.subTitle }}
                  >
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
                    <Typography variant="detail2" color={theme.palette.text.disabled}>
                      <Trans>$0</Trans>
                    </Typography>
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
                    <Typography variant="detail2" color={theme.palette.text.disabled}>
                      <Trans>$0</Trans>
                    </Typography>
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
                    <Typography variant="detail2" color={theme.palette.text.disabled}>
                      <Trans>$0</Trans>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                mt: '20px',
                px: '20px',
                py: '36px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '40px',
                bgcolor: theme.palette.background.primary,
                boxShadow: '4px 4px 20px 0px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box>
                <Box>
                  <Typography variant="h2" color="text.secondary" mb="28px">
                    <Trans>Referral program details</Trans>
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '40px',
                    px: '40px',
                    py: '20px',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    alignItems: 'center',
                  }}
                >
                  <Box flex={1}>
                    <Typography variant="body2">
                      <Trans>CODE</Trans>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '20px',
                      width: '600px',
                    }}
                  >
                    <Box
                      sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <Typography variant="body7" color={theme.palette.text.mainTitle}>
                        <Trans>Estimated referral reward</Trans>
                      </Typography>
                      <Typography variant="h2" color="text.primary">
                        <Trans>1.23</Trans>
                      </Typography>
                      <Typography variant="body7" color={theme.palette.text.mainTitle}>
                        <Trans>$9.91</Trans>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <Typography variant="body7" color={theme.palette.text.mainTitle}>
                        <Trans>Claimable referral reward</Trans>
                      </Typography>
                      <Typography variant="h2" color="text.primary">
                        <Trans>2.40</Trans>
                      </Typography>
                      <Typography variant="body7" color={theme.palette.text.mainTitle}>
                        <Trans>$19.68</Trans>
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      width: '236px',
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{
                        p: '12px',
                        height: '45px',
                        width: '100%',
                        // ...(+availableToClaim === 0 && {
                        //   bgcolor: theme.palette.text.disabledBg,
                        //   color: theme.palette.text.disabledText,
                        // }),
                        bgcolor: theme.palette.point.primary,
                        color: theme.palette.text.buttonText,
                      }}
                      //   onClick={onClaimAction}
                      //   disabled={+availableToClaim === 0}
                    >
                      <Trans>Claim on Ethereum</Trans>
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        p: '12px',
                        height: '45px',
                        width: '100%',
                        // ...(+availableToClaim === 0 && {
                        //   bgcolor: theme.palette.text.disabledBg,
                        //   color: theme.palette.text.disabledText,
                        // }),
                        bgcolor: theme.palette.point.primary,
                        color: theme.palette.text.buttonText,
                      }}
                      //   onClick={onClaimAction}
                      //   disabled={+availableToClaim === 0}
                    >
                      <Trans>Claim on Kaia</Trans>
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        p: '12px',
                        height: '45px',
                        width: '100%',
                        // ...(+availableToClaim === 0 && {
                        //   bgcolor: theme.palette.text.disabledBg,
                        //   color: theme.palette.text.disabledText,
                        // }),
                        bgcolor: theme.palette.point.primary,
                        color: theme.palette.text.buttonText,
                      }}
                      //   onClick={onClaimAction}
                      //   disabled={+availableToClaim === 0}
                    >
                      <Trans>Claim on TON</Trans>
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box>
                  <StatusListHeader
                    statusFilter={statusFilter}
                    handleStatusFilterChange={setStatusFilter}
                    handleSearchQueryChange={setSearchTerm}
                  />
                </Box>
                {/* <Box
                  sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', px: 0 }}
                >
                  <SearchInput
                    wrapperSx={{
                      width: '320px',
                    }}
                    placeholder="Search assets..."
                    onSearchTermChange={setSearchQuery}
                    key={searchResetKey}
                  />
                  <Button onClick={() => handleCancelClick()}>
                    <Typography variant="buttonM">
                      <Trans>Cancel</Trans>
                    </Typography>
                  </Button>
                </Box> */}
              </Box>
            </Box>
          </Container>
        ) : (
          <ConnectWalletPaperReferral
            isSwitchWallet
            titleHeader={<Trans>The connected wallet doesn’t support referral program.</Trans>}
            description={
              <Trans>
                Please connect an Ethereum, Kaia, TON wallet to participate in the referral program.
              </Trans>
            }
            loading={loading}
          />
        )
      ) : (
        <ConnectWalletPaperReferral
          titleHeader={<Trans>Please connect a wallet</Trans>}
          description={<Trans>Connect a wallet to check the referral program. </Trans>}
          loading={loading}
        />
      )}
    </Box>
  );
};
