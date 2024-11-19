import { Box, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { Fragment } from 'react';
import { ProposalVote } from 'src/hooks/governance/useProposalVotes';

import { VotersListItem } from './VotersListItem';

type VotersListProps = {
  isModal?: boolean;
  compact?: boolean;
  voters: ProposalVote[];
  sx?: SxProps<Theme>;
};

export const VotersList = ({
  isModal = false,
  compact = false,
  voters,
  sx,
}: VotersListProps): JSX.Element => {
  return (
    <Box
      sx={{
        mr: isModal ? '13px' : 0,
        maxHeight: '224px',
        bgcolor: 'background.point',
        overflow: 'hidden',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          width: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: (theme) => theme.palette.text.disabledText,
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
        '&::-webkit-scrollbar-track': {
          borderLeft: '1px solid',
          borderColor: 'divider',
          background: '#FFFFFF',
        },
        ...sx,
      }}
    >
      {voters.length === 0 ? (
        <Box sx={{ color: 'text.secondary' }}>—</Box>
      ) : (
        voters
          .sort((a, b) => Number(b.votingPower) - Number(a.votingPower))
          .map((voter) => (
            <Fragment key={voter.voter}>
              <VotersListItem voter={voter} compact={compact} isModal={isModal} />
            </Fragment>
          ))
      )}
    </Box>
  );
};
