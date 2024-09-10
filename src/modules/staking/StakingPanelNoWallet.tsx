import { Trans } from '@lingui/macro';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { MeritIncentivesButton } from 'src/components/incentives/IncentivesButton';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { StakeTokenFormatted, useGeneralStakeUiData } from 'src/hooks/stake/useGeneralStakeUiData';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

export interface StakingPanelNoWalletProps {
  description?: React.ReactNode;
  headerAction?: React.ReactNode;
  stakedToken: string;
  icon: string;
  networkName?: string;
}

export const StakingPanelNoWallet: React.FC<StakingPanelNoWalletProps> = ({
  stakedToken,
  icon,
  networkName,
}) => {
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  let stakingAPY = '';
  const { chainId } = useWeb3Context();
  const networkConfig = getNetworkConfig(chainId);

  const { data: stakeGeneralResult } = useGeneralStakeUiData(currentMarketData);

  let stkAave: StakeTokenFormatted | undefined;
  let stkBpt: StakeTokenFormatted | undefined;
  let stkGho: StakeTokenFormatted | undefined;
  let stkBptV2: StakeTokenFormatted | undefined;
  if (stakeGeneralResult && Array.isArray(stakeGeneralResult)) {
    [stkAave, stkBpt, stkGho, stkBptV2] = stakeGeneralResult;
  }

  if (stakedToken == 'AAVE') stakingAPY = stkAave?.stakeApy || '0';
  if (stakedToken == 'ABPT') stakingAPY = stkBpt?.stakeApy || '0';
  if (stakedToken == 'GHO') stakingAPY = stkGho?.stakeApy || '0';
  if (stakedToken == 'ABPT V2') stakingAPY = stkBptV2?.stakeApy || '0';

  const distributionEnded = Date.now() / 1000 > Number(stkGho?.distributionEnd);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        gap: 3,
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: '6px',
        border: `1px solid ${theme.palette.divider}`,
        px: 5,
        py: 2,
        background: 'transparent',
        width: '100%',
        height: '68px',
        margin: '0 auto',
        position: 'relative',
        textAlign: 'left',
        '&:after': {
          content: "''",
          position: 'absolute',
          bottom: 0,
          left: '0px',
          width: 'calc(100% + 32px)',
          height: '1px',
          bgcolor: 'transparent',
        },
      })}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: 3,
          flex: 1,
        }}
      >
        <img width="24px" height="24px" src={icon} />
        <Stack direction="column" alignItems="start">
          <Typography variant="body2" color="text.primary" sx={{ textAlign: 'left' }}>
            Stake {stakedToken} on {networkName ? networkName : networkConfig?.name} mainnet
          </Typography>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'block',
          width: { xs: '100%', xsm: 'unset' },
          justifyContent: 'space-between',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Typography color="text.mainTitle" variant="detail2">
            <Trans>Staking APR</Trans>
          </Typography>

          {distributionEnded && stakedToken === 'GHO' && (
            <TextWithTooltip wrapperProps={{ marginBottom: '1px' }} iconColor="warning.main">
              <Trans>
                The current incentives period, decided on by the Aave community, has ended.
                Governance is in the process on renewing, check for updates.{' '}
                <Link
                  href="https://governance.aave.com"
                  sx={{ textDecoration: 'underline' }}
                  variant="caption"
                  color="text.secondary"
                >
                  Learn more
                </Link>
                .
              </Trans>
            </TextWithTooltip>
          )}

          <FormattedNumber
            variant="detail2"
            value={parseFloat(stakingAPY || '0') / 10000}
            symbol="USD"
            color="text.mainTitle"
            symbolsColor="text.mainTitle"
          />
        </Box>
      </Box>
    </Box>
  );
};
