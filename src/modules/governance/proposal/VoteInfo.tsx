import { VotingMachineProposalState } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
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
    <Paper
      sx={{
        py: { xs: 4, sxm: 9 },
        px: 4,
        bgcolor: 'background.top',
        height: '100%',
      }}
    >
      <Row
        sx={{ mb: '24px' }}
        caption={
          <>
            <Typography variant={'h2'} color={'text.primary'} sx={{ mb: '16px' }}>
              <Trans>Your info</Trans>
            </Typography>
            {network && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography variant={xsm ? 'body2' : 'detail2'} color={'text.primary'}>
                  <Trans>Voting is on</Trans>
                </Typography>
                <Box
                  sx={{
                    height: xsm ? '24px' : '18px',
                    aspectRatio: '1/1',
                    mx: '6px',
                  }}
                >
                  <img
                    src={network.networkLogoPath}
                    alt="network logo"
                    style={{ height: '100%', width: '100%' }}
                  />
                </Box>
                <Typography variant={xsm ? 'body2' : 'detail2'} color={'text.primary'}>
                  {network?.displayName}
                </Typography>
              </Box>
            )}
          </>
        }
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: { xs: 3, xsm: 7 },
          mb: { xs: 4, xsm: 10 },
        }}
      >
        {user ? (
          <>
            {user && !didVote && !voteOngoing && (
              <Box>
                <Warning severity="error" sx={{ mb: 0 }}>
                  <Trans>You did not participate in this proposal</Trans>
                </Warning>
              </Box>
            )}
            {user && voteOngoing && (
              <Row
                caption={
                  <>
                    <Typography variant="h3" color="text.mainTitle" mb="8px">
                      <Trans>Voting power</Trans>
                    </Typography>
                    <Typography variant="detail2" color="text.mainTitle">
                      (CODE + stkCODE)
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
              <Box>
                <Warning
                  severity={voteOnProposal.support ? 'success' : 'warning'}
                  sx={
                    voteOnProposal.support
                      ? {
                          bgcolor: `${theme.palette.point.noti} !important`,
                          px: '4px !important',
                          mb: 0,
                          '.MuiAlert-message': { p: 0 },
                        }
                      : { mb: 0 }
                  }
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="detail1" color="text.secondary">
                      <Trans>You voted {voteOnProposal.support ? 'YAE' : 'NAY'}</Trans>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Trans>
                        With a voting power of{' '}
                        <FormattedNumber
                          value={
                            formatUnits(proposal.votingMachineData.votedInfo.votingPower, 18) || 0
                          }
                          variant="detail4"
                          color="text.secondary"
                          visibleDecimals={2}
                        />
                      </Trans>
                    </Box>
                  </Box>
                </Warning>
              </Box>
            )}
            {showCannotVoteMsg && (
              <Warning severity="warning" sx={{ mb: 0 }}>
                <Trans>Not enough voting power to participate in this proposal</Trans>
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
                >
                  <Trans>Vote NAY</Trans>
                </Button>
              </>
            )}
            <Box sx={{ mt: { xs: 4, xsm: 10 } }}>
              <ProposalLifecycle proposal={proposal} />
            </Box>
          </>
        ) : (
          <ConnectWalletButton />
        )}
      </Box>
    </Paper>
  );
}
