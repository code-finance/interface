import { Trans } from '@lingui/macro';
import { Box, Button, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { Row } from 'src/components/primitives/Row';
import { ProposalVotes } from 'src/hooks/governance/useProposalVotes';
import { useRootStore } from 'src/store/root';
import { AIP } from 'src/utils/mixPanelEvents';

import { ProposalVoteInfo } from '../utils/formatProposal';
import { VotersList } from './VotersList';
import { VotersListModal } from './VotersListModal';

type VotersListProps = {
  proposal: ProposalVoteInfo;
  proposalVotes: ProposalVotes;
};

export type GovernanceVoter = {
  address: string;
  ensName: string | null;
  votingPower: number;
  twitterAvatar: string | null;
  support: boolean;
};

export type VotersData = {
  yaes: GovernanceVoter[];
  nays: GovernanceVoter[];
  combined: GovernanceVoter[];
};

export const VotersListContainer = ({ proposal, proposalVotes }: VotersListProps): JSX.Element => {
  const [votersModalOpen, setVotersModalOpen] = useState(false);
  const { breakpoints } = useTheme();
  const mdScreen = useMediaQuery(breakpoints.only('md'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleOpenAllVotes = () => {
    trackEvent(AIP.VIEW_ALL_VOTES);
    setVotersModalOpen(true);
  };

  if (false)
    return (
      <Box sx={{ mt: 8, mb: 12 }}>
        <Row sx={{ mb: 3 }}>
          <Typography sx={{ ml: 'auto' }} variant="subheader2" color="text.secondary">
            <Trans>Votes</Trans>
          </Typography>
        </Row>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress size={24} sx={{ my: 4 }} />
        </Box>
      </Box>
    );

  if (false)
    return (
      <Box sx={{ mt: 8, mb: 12 }}>
        <Row sx={{ mb: 3 }}>
          <Typography sx={{ ml: 'auto' }} variant="subheader2" color="text.secondary">
            <Trans>Votes</Trans>
          </Typography>
        </Row>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 8 }}>
          <Typography variant="helperText" color="error.main">
            <Trans>Failed to load proposal voters. Please refresh the page.</Trans>
          </Typography>
        </Box>
      </Box>
    );

  if (!proposalVotes || proposalVotes.combinedVotes.length === 0) return <Box sx={{ mt: 8 }} />;

  return (
    <Box sx={{ my: '60px' }}>
      <Row sx={{ mb: 4 }}>
        <Typography variant="body4" color="text.primary">
          {proposalVotes.combinedVotes.length > 10 ? (
            <Trans>Top 10 addresses</Trans>
          ) : (
            <Trans>Addresses</Trans>
          )}
        </Typography>
        <Typography variant="detail3" color="text.mainTitle">
          <Trans>Votes</Trans>
        </Typography>
      </Row>
      <VotersList
        compact={mdScreen}
        voters={proposalVotes.combinedVotes.slice(0, 10)}
        sx={{ pl: '12px', pr: '30px', py: '12px' }}
      />
      {proposalVotes.combinedVotes.length > 10 && (
        <Button
          sx={{
            mt: 6,
            height: '45px',
            width: '100%',
          }}
          size="medium"
          variant="outlined"
          fullWidth
          onClick={handleOpenAllVotes}
        >
          <Typography variant="body6" color="text.primary">
            <Trans>View all votes</Trans>
          </Typography>
        </Button>
      )}
      {votersModalOpen && (
        <VotersListModal
          open={votersModalOpen}
          close={() => setVotersModalOpen(false)}
          proposal={proposal}
          voters={proposalVotes}
        />
      )}
    </Box>
  );
};
