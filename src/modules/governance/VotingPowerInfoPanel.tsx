import { Trans } from '@lingui/macro';
import { Box, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { CompactMode } from 'src/components/CompactableTypography';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { UserDisplay } from 'src/components/UserDisplay';
import { usePowers } from 'src/hooks/governance/usePowers';
import { GENERAL } from 'src/utils/mixPanelEvents';

export function VotingPowerInfoPanel() {
  const { data: powers } = usePowers();
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  const color = theme.palette.mode === 'light' ? 'text.subText' : 'text.mainTitle';
  return (
    <Box
      sx={{
        display: 'flex',
        gap: { xs: 4, lg: 15 },
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ p: 1 }}>
        <UserDisplay
          withLink={true}
          avatarProps={{ size: xsm ? 36 : 31 }}
          titleProps={{
            variant: xsm ? 'body8' : 'body7',
            color: 'text.buttonText',
            addressCompactMode: CompactMode.MD,
          }}
          subtitleProps={{
            variant: 'caption',
            addressCompactMode: CompactMode.XXL,
            color: 'text.secondary',
          }}
          funnel={'Your info: Governance'}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 4, lg: 15 },
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        {powers ? (
          <>
            <Box sx={{ minWidth: { xs: 'unset', xsm: '157px' } }}>
              <TextWithTooltip
                text="Voting power"
                variant={xsm ? 'body3' : 'detail2'}
                textColor={color}
                iconColor={color}
                iconSize={xsm ? 18 : 14}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Voting Power',
                    funnel: 'Governance Page',
                  },
                }}
              >
                <>
                  <Typography variant="subheader2">
                    <Trans>
                      Your voting power is based on your AAVE/stkAAVE balance and received
                      delegations.
                    </Trans>
                  </Typography>
                  <Typography variant="subheader2" mt={4}>
                    <Trans>Use it to vote for or against active proposals.</Trans>
                  </Typography>
                </>
              </TextWithTooltip>
              <FormattedNumber
                data-cy={`voting-power`}
                value={powers.votingPower}
                variant={'body1'}
                color="text.buttonText"
                visibleDecimals={2}
              />
            </Box>
            <Box sx={{ minWidth: { xs: 'unset', xsm: '157px' } }}>
              <TextWithTooltip
                text="Proposition power"
                variant={xsm ? 'body3' : 'detail2'}
                textColor={color}
                iconColor={color}
                iconSize={xsm ? 18 : 14}
                event={{
                  eventName: GENERAL.TOOL_TIP,
                  eventParams: {
                    tooltip: 'Proposition Power',
                    funnel: 'Governance Page',
                  },
                }}
              >
                <>
                  <Typography variant="subheader2">
                    <Trans>
                      Your proposition power is based on your AAVE/stkAAVE balance and received
                      delegations.
                    </Trans>
                  </Typography>
                  <Typography variant="subheader2" mt={4}>
                    <Trans>
                      To submit a proposal for minor changes to the protocol, you&apos;ll need at
                      least 80.00K power. If you want to change the core code base, you&apos;ll need
                      320k power.
                      <Link
                        href="https://docs.aave.com/developers/v/2.0/protocol-governance/governance"
                        target="_blank"
                        variant="description"
                        sx={{ textDecoration: 'underline', ml: 1 }}
                      >
                        <Trans>Learn more.</Trans>
                      </Link>
                    </Trans>
                  </Typography>
                </>
              </TextWithTooltip>
              <FormattedNumber
                data-cy={`proposition-power`}
                value={powers.propositionPower}
                variant="body1"
                color="text.buttonText"
                visibleDecimals={2}
              />
            </Box>
          </>
        ) : (
          <Skeleton />
        )}
      </Box>
    </Box>
  );
}
