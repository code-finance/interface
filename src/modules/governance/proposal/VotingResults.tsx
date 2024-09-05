import { Trans } from '@lingui/macro';
import { Box, Paper, Skeleton, Typography, useTheme } from '@mui/material';
import { CheckBadge } from 'src/components/primitives/CheckBadge';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { Proposal } from 'src/hooks/governance/useProposals';
import { ProposalVotes } from 'src/hooks/governance/useProposalVotes';

import { StateBadge } from '../StateBadge';
import { VoteBar } from '../VoteBar';
import { VotersListContainer } from './VotersListContainer';

interface VotingResultsPros {
  proposal?: Proposal;
  proposalVotes?: ProposalVotes;
  loading: boolean;
}

export const VotingResults = ({ proposal, loading, proposalVotes }: VotingResultsPros) => {
  const theme = useTheme();
  return (
    <Paper sx={{ p: '28px 20px 28px 24px', bgcolor: 'background.top', height: '100%' }}>
      <Typography variant="h2" color={'text.primary'} sx={{ mb: '55px' }}>
        <Trans>Voting results</Trans>
      </Typography>
      {proposal ? (
        <>
          <VoteBar
            yae
            percent={proposal.votingInfo.forPercent}
            votes={proposal.votingInfo.forVotes}
            loading={loading}
            bg={theme.palette.background.primary}
          />
          <VoteBar
            percent={proposal.votingInfo.againstPercent}
            votes={proposal.votingInfo.againstVotes}
            sx={{ mt: '19px' }}
            loading={loading}
            bg={theme.palette.background.primary}
          />
          {proposalVotes && (
            <VotersListContainer proposal={proposal.votingInfo} proposalVotes={proposalVotes} />
          )}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <Row
              caption={
                <Typography variant="body6">
                  <Trans>State</Trans>
                </Typography>
              }
              sx={{ height: '24px' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  height: '24px',
                }}
              >
                <StateBadge
                  state={proposal.badgeState}
                  loading={loading}
                  wrapperSx={{ py: '3px', px: 1, height: 24, borderRadius: 1 }}
                />
                {/*
                <Box sx={{ mt: 0.5 }}>
                  <FormattedProposalTime
                    state={proposal.proposalState}
                    startTimestamp={proposal.startTimestamp}
                    executionTime={proposal.executionTime}
                    expirationTimestamp={proposal.expirationTimestamp}
                    executionTimeWithGracePeriod={proposal.executionTimeWithGracePeriod}
                  />
                </Box>
                */}
              </Box>
            </Row>
            <Row
              caption={
                <Typography variant="body6">
                  <Trans>Quorum</Trans>
                </Typography>
              }
              sx={{ height: '24px' }}
            >
              <CheckBadge
                loading={loading}
                text={
                  proposal.votingInfo.quorumReached ? (
                    <Trans>Reached</Trans>
                  ) : (
                    <Trans>Not reached</Trans>
                  )
                }
                checked={proposal.votingInfo.quorumReached}
                sx={{ height: '24px' }}
                variant="detail2"
                color="text.primary"
              />
            </Row>
            <Row
              caption={
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body6" color="text.primary" mb={1}>
                    <Trans>Current votes</Trans>
                  </Typography>
                  <Typography variant="detail4" color="text.mainTitle">
                    Current votes
                  </Typography>
                </Box>
              }
              sx={{ height: '42px' }}
              captionVariant="description"
            >
              <Box sx={{ textAlign: 'right' }}>
                <FormattedNumber
                  variant="detail2"
                  color="text.primary"
                  value={proposal.votingInfo.forVotes}
                  visibleDecimals={2}
                  roundDown
                  sx={{ display: 'block' }}
                />
                <FormattedNumber
                  variant="detail4"
                  color={'text.mainTitle'}
                  value={proposal.votingInfo.quorum}
                  visibleDecimals={2}
                  roundDown
                />
              </Box>
            </Row>
            <Row
              caption={
                <Typography variant="body6" color="text.primary">
                  <Trans>Differential</Trans>
                </Typography>
              }
              sx={{ height: '24px', display: 'flex', alignItems: 'center' }}
              captionVariant="description"
            >
              <CheckBadge
                loading={loading}
                text={
                  proposal.votingInfo.differentialReached ? (
                    <Typography variant="detail2" color="text.primary">
                      <Trans>Reached</Trans>
                    </Typography>
                  ) : (
                    <Typography variant="detail2" color="text.primary">
                      <Trans>Not reached</Trans>
                    </Typography>
                  )
                }
                checked={proposal.votingInfo.differentialReached}
                variant="description"
              />
            </Row>
            <Row
              caption={
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body6" color="text.primary" mb={1}>
                    <Trans>Current differential</Trans>
                  </Typography>
                  <Typography variant="detail4" color="text.mainTitle">
                    Required
                  </Typography>
                </Box>
              }
              sx={{ height: '42px' }}
              captionVariant="description"
            >
              <Box sx={{ textAlign: 'right' }}>
                <FormattedNumber
                  variant="detail2"
                  color="text.primary"
                  value={proposal.votingInfo.currentDifferential}
                  visibleDecimals={2}
                  roundDown
                  sx={{ display: 'block' }}
                />
                <FormattedNumber
                  variant="detail4"
                  color="text.mainTitle"
                  value={proposal.votingInfo.requiredDifferential}
                  visibleDecimals={2}
                  roundDown
                />
              </Box>
            </Row>
          </Box>
          {/*
          <Row
            caption={<Trans>Total voting power</Trans>}
            sx={{ height: 48 }}
            captionVariant="description"
          >
            <FormattedNumber
              value={normalize(proposal.totalVotingSupply, 18)}
              visibleDecimals={0}
              compact={false}
            />
          </Row>
*/}
        </>
      ) : (
        <>
          <Skeleton height={28} sx={{ mt: 8 }} />
          <Skeleton height={28} sx={{ mt: 8 }} />
        </>
      )}
    </Paper>
  );
};
