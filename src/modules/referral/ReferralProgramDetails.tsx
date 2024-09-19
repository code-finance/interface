import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

import { ReferralWalletCycle } from './ReferralWalletCycle';
import { StatusListHeader } from './StatusListHeader';

export const ReferralProgramDetails = ({
  statusFilter,
  setStatusFilter,
  setSearchTerm,
}: {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  setSearchTerm: (searchTerm: string) => void;
}) => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
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
          <Typography variant={xsm ? 'h2' : 'h3'} color="text.secondary" mb="28px">
            <Trans>Referral program details</Trans>
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: xsm ? 'row' : 'column',
            gap: xsm ? '40px' : '30px',
            px: '40px',
            py: '20px',
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
          }}
        >
          <Box flex={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: xsm ? '12px' : '4px' }}>
              <img width="24px" height="24px" src={'/icons/networks/ethereum.svg'} />{' '}
              <Typography variant="body2">
                <Trans>CODE</Trans>
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: xsm ? 'row' : 'column',
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
                gap: xsm ? '10px' : '4px',
              }}
            >
              <Typography
                variant={xsm ? 'body7' : 'description'}
                color={theme.palette.text.mainTitle}
              >
                <Trans>Estimated referral reward</Trans>
              </Typography>
              <Typography variant={xsm ? 'h2' : 'h3'} color="text.primary">
                <Trans>1.23</Trans>
              </Typography>
              <FormattedNumber
                variant={xsm ? 'body7' : 'detail3'}
                symbolsVariant={xsm ? 'body7' : 'detail3'}
                symbolsColor={theme.palette.text.mainTitle}
                symbol="USD"
                value={9.91}
                sx={{ color: theme.palette.text.mainTitle }}
                visibleDecimals={2}
              />
            </Box>
            <Box
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: xsm ? '10px' : '4px',
              }}
            >
              <Typography variant="body7" color={theme.palette.text.mainTitle}>
                <Trans>Claimable referral reward</Trans>
              </Typography>
              <Typography variant={xsm ? 'h2' : 'h3'} color="text.primary">
                <Trans>2.40</Trans>
              </Typography>
              <FormattedNumber
                variant={xsm ? 'body7' : 'detail3'}
                symbolsVariant={xsm ? 'body7' : 'detail3'}
                symbolsColor={theme.palette.text.mainTitle}
                symbol="USD"
                value={19.68}
                sx={{ color: theme.palette.text.mainTitle }}
                visibleDecimals={2}
              />
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
                p: xsm ? '12px' : '8px',
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
              <Typography variant="body7" color="text.button">
                <Trans>Claim on</Trans>
              </Typography>
              <Box sx={{ px: '4px', display: 'inline-flex' }}>
                <img width="24px" height="24px" src={'/icons/networks/ethereum.svg'} />{' '}
              </Box>
              <Typography variant="body6" color="text.button">
                <Trans>Ethereum</Trans>
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                p: xsm ? '12px' : '8px',
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
              <Typography variant="body7" color="text.button">
                <Trans>Claim on</Trans>
              </Typography>
              <Box sx={{ px: '4px', display: 'inline-flex' }}>
                <img width="24px" height="24px" src={'/icons/networks/ethereum.svg'} />{' '}
              </Box>
              <Typography variant="body6" color="text.button">
                <Trans>Kaia</Trans>
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{
                p: xsm ? '12px' : '8px',
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
              <Typography variant="body7" color="text.button">
                <Trans>Claim on</Trans>
              </Typography>
              <Box sx={{ px: '4px', display: 'inline-flex' }}>
                <img width="24px" height="24px" src={'/icons/networks/ton.svg'} />{' '}
              </Box>
              <Typography variant="body6" color="text.button">
                <Trans>TON</Trans>
              </Typography>
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
      </Box>
      <Box>
        <ReferralWalletCycle />
      </Box>
    </Box>
  );
};
