import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { Proposal } from 'src/hooks/governance/useProposals';
import { useRootStore } from 'src/store/root';
import { GOVERNANCE_PAGE } from 'src/utils/mixPanelEvents';

import { StateBadge } from './StateBadge';
import { VoteBar } from './VoteBar';

dayjs.extend(relativeTime);

export const ProposalV3ListItem = ({ proposal }: { proposal: Proposal }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        px: { xs: 0, md: 2 },
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: { xs: 3, md: 5 },
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
      component={Link}
      onClick={() => trackEvent(GOVERNANCE_PAGE.VIEW_AIP, { AIP: proposal.subgraphProposal.id })}
      href={ROUTES.dynamicRenderedProposal(+proposal.subgraphProposal.id)}
    >
      <Stack
        direction="column"
        gap={5}
        sx={{
          flex: 1,
          pr: { xs: 0, md: 5 },
          gap: { xs: 3, md: 5 },
          display: 'flex',
          height: '128px',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <StateBadge state={proposal.badgeState} loading={false} />
        <Typography
          variant="h5"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            '-webkit-line-clamp': '2',
            '-webkit-box-orient': 'vertical',
          }}
          color="text.primary"
        >
          {proposal.subgraphProposal.proposalMetadata.title}
        </Typography>
      </Stack>
      <Stack
        flexGrow={1}
        direction="column"
        justifyContent="center"
        sx={{
          maxWidth: { xs: '100%', lg: '320px' },
          width: '100%',
        }}
      >
        <VoteBar
          yae
          percent={proposal.votingInfo.forPercent}
          votes={proposal.votingInfo.forVotes}
          sx={{ mb: 4 }}
          compact
        />
        <VoteBar percent={0.6} votes={120} compact />
      </Stack>
    </Box>
  );
};
