import { VotingMachineProposalState } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, Paper, Typography } from '@mui/material';
import { constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Row } from 'src/components/primitives/Row';
import { Warning } from 'src/components/primitives/Warning';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { Proposal } from 'src/hooks/governance/useProposals';
import { useVotingPowerAt } from 'src/hooks/governance/useVotingPowerAt';
import { useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';

import { networkConfigs } from '../../../ui-config/networksConfig';
import { ProposalLifecycle } from './ProposalLifecycle';

interface VoteInfoProps {
  proposal: Proposal;
}

export function VoteInfo({ proposal }: VoteInfoProps) {
  const { openGovVote } = useModalContext();
  const user = useRootStore((state) => state.account);
  const voteOnProposal = proposal.votingMachineData.votedInfo;
  const votingChainId = proposal.subgraphProposal.votingPortal.votingMachineChainId;
  const network = networkConfigs[votingChainId];

  const blockHash =
    proposal.subgraphProposal.snapshotBlockHash === constants.HashZero
      ? 'latest'
      : proposal.subgraphProposal.snapshotBlockHash;

  const { data: powerAtProposalStart } = useVotingPowerAt(
    blockHash,
    proposal.votingMachineData.votingAssets
  );

  const voteOngoing = proposal.votingMachineData.state === VotingMachineProposalState.Active;

  const didVote = powerAtProposalStart && voteOnProposal?.votingPower !== '0';
  const showAlreadyVotedMsg = !!user && voteOnProposal && didVote;

  const showCannotVoteMsg = !!user && voteOngoing && Number(powerAtProposalStart) === 0;
  const showCanVoteMsg =
    powerAtProposalStart && !didVote && !!user && voteOngoing && Number(powerAtProposalStart) !== 0;

  return (
    <Paper sx={{ px: '24px', py: '28px', bgcolor: 'background.top' }}>
      <Row
        sx={{ mb: '24px' }}
        caption={
          <>
            <Typography variant="h2" color={'text.primary'} sx={{ mb: '16px' }}>
              <Trans>Your info</Trans>
            </Typography>
            {network && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body2">
                  <Trans>Voting is on</Trans>
                </Typography>
                <Box
                  sx={{
                    height: '24px',
                    width: '24px',
                    mx: '6px',
                  }}
                >
                  <img
                    src={network.networkLogoPath}
                    alt="network logo"
                    style={{ height: '100%', width: '100%' }}
                  />
                </Box>
                <Typography variant="body2" color={'text.primary'}>
                  {network?.displayName}
                </Typography>
              </Box>
            )}
          </>
        }
      />
      {user ? (
        <>
          {user && !didVote && !voteOngoing && (
            <Typography variant="h3" sx={{ textAlign: 'left', mb: '28px' }} color="text.mainTitle">
              <Trans>You did not participate in this proposal</Trans>
            </Typography>
          )}
          {user && voteOngoing && (
            <Row
              sx={{ mb: '28px' }}
              caption={
                <>
                  <Typography variant="h3" color="text.mainTitle" mb="8px">
                    <Trans>Voting power</Trans>
                  </Typography>
                  <Typography variant="detail2" color="text.mainTitle">
                    (AAVE + stkAAVE)
                  </Typography>
                </>
              }
            >
              <FormattedNumber
                value={powerAtProposalStart || 0}
                variant="body1"
                color={'text.mainTitle'}
                visibleDecimals={2}
              />
            </Row>
          )}
          {showAlreadyVotedMsg && (
            <Warning severity={voteOnProposal.support ? 'success' : 'error'} sx={{ my: 2 }}>
              <Typography variant="subheader1">
                <Trans>You voted {voteOnProposal.support ? 'YAE' : 'NAY'}</Trans>
              </Typography>
              <Typography variant="caption">
                <Trans>
                  With a voting power of{' '}
                  <FormattedNumber
                    value={formatUnits(proposal.votingMachineData.votedInfo.votingPower, 18) || 0}
                    variant="caption"
                    visibleDecimals={2}
                  />
                </Trans>
              </Typography>
            </Warning>
          )}
          {showCannotVoteMsg && (
            <Warning severity="warning" sx={{ mb: '40px' }}>
              <Typography variant="body7" color="text.secondary">
                <Trans>Not enough voting power to participate in this proposal</Trans>
              </Typography>
            </Warning>
          )}
          {showCanVoteMsg && (
            <>
              <Button
                color="success"
                variant="contained"
                fullWidth
                onClick={() => openGovVote(proposal, true, powerAtProposalStart)}
              >
                <Trans>Vote YAE</Trans>
              </Button>
              <Button
                color="error"
                variant="contained"
                fullWidth
                onClick={() => openGovVote(proposal, false, powerAtProposalStart)}
                sx={{ mt: 2 }}
              >
                <Trans>Vote NAY</Trans>
              </Button>
            </>
          )}
          <ProposalLifecycle proposal={proposal} />
        </>
      ) : (
        <ConnectWalletButton />
      )}
    </Paper>
  );
}
