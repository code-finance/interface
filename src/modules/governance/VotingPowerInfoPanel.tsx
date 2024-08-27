import { Trans } from '@lingui/macro';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { AvatarSize } from 'src/components/Avatar';
import { CompactMode } from 'src/components/CompactableTypography';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link } from 'src/components/primitives/Link';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { UserDisplay } from 'src/components/UserDisplay';
import { usePowers } from 'src/hooks/governance/usePowers';
import { GENERAL } from 'src/utils/mixPanelEvents';

export function VotingPowerInfoPanel() {
  const { data: powers } = usePowers();
  return (
    <Paper sx={(theme) => ({ px: 6, py: 7, background: theme.palette.background.group })}>
      <Typography variant="h3" color="text.buttonText" sx={{ mb: { xs: 2, xsm: 4 } }}>
        <Trans>Your supplies</Trans>
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 6, md: 10, lg: 15 },
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ p: 1 }}>
          <UserDisplay
            withLink={true}
            avatarProps={{ size: 36 }}
            titleProps={{
              variant: 'body8',
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
        {powers ? (
          <>
            <Box sx={{ minWidth: '157px' }}>
              <TextWithTooltip
                text="Voting power"
                variant="body3"
                textColor="text.subText"
                iconColor="text.subText"
                iconSize={18}
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
                variant="body1"
                color="text.buttonText"
                visibleDecimals={2}
              />
            </Box>
            <Box sx={{ minWidth: '157px' }}>
              <TextWithTooltip
                text="Proposition power"
                variant="body3"
                textColor="text.subText"
                iconColor="text.subText"
                iconSize={18}
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
    </Paper>
  );
}
