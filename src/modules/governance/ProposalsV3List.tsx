import { Box, Paper, Skeleton, Stack } from '@mui/material';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { NoSearchResults } from 'src/components/NoSearchResults';
import { Proposal, useProposals } from 'src/hooks/governance/useProposals';
import { useProposalsSearch } from 'src/hooks/governance/useProposalsSearch';

import { ProposalListHeader } from './ProposalListHeader';
import { ProposalV3ListItem } from './ProposalV3ListItem';
import { stringToState } from './StateBadge';
import { VoteBar } from './VoteBar';

// const mockListItems: Proposal[] = [
//   {
//     subgraphProposal: {
//       id: '1',
//       creator: '0xCreatorAddress1',
//       accessLevel: 'public',
//       ipfsHash: 'QmHash1',
//       proposalMetadata: {
//         id: '1',
//         title: 'Proposal 1',
//         rawContent: 'Detailed content for proposal 1',
//       },
//       state: 'Active',
//       votingPortal: {
//         id: '1',
//         votingMachineChainId: '1',
//         votingMachine: '0x0000000000000000000000000000000000000000',
//         enabled: true,
//       },
//       votingConfig: {
//         id: '1',
//         cooldownBeforeVotingStart: '3600',
//         votingDuration: '86400',
//         yesThreshold: '0.5',
//         yesNoDifferential: '0.1',
//         minPropositionPower: '100',
//       },
//       payloads: [
//         {
//           id: '1_1',
//           chainId: '1',
//           accessLevel: 'public',
//           payloadsController: '0xControllerAddress1',
//         },
//       ],
//       transactions: {
//         id: '1',
//         created: {
//           id: '1',
//           blockNumber: 123456,
//           timestamp: 1633024800,
//         },
//         active: null,
//         queued: null,
//         failed: null,
//         executed: null,
//         canceled: null,
//       },
//       votingDuration: '86400',
//       snapshotBlockHash: '0x123',
//       votes: {
//         id: '1',
//         forVotes: '1000',
//         againstVotes: '100',
//       },
//       constants: {
//         id: '1',
//         precisionDivider: '1000000',
//         cooldownPeriod: '3600',
//         expirationTime: '172800',
//         cancellationFee: '10',
//       },
//     },
//     lifecycleState: 'Active',
//     badgeState: 'Open for voting',
//     votingMachineData: {
//       proposalData: {
//         id: '1',
//         forVotes: '1000',
//         againstVotes: '100',
//       },
//     },
//     payloadsData: [],
//     votingInfo: {
//       forVotes: '1000',
//       againstVotes: '100',
//       totalVotes: '1100',
//     },
//   },
//   {
//     subgraphProposal: {
//       id: '2',
//       creator: '0xCreatorAddress2',
//       accessLevel: 'public',
//       ipfsHash: 'QmHash2',
//       proposalMetadata: {
//         id: '2',
//         title: 'Proposal 2',
//         rawContent: 'Detailed content for proposal 2',
//       },
//       state: 'Pending',
//       votingPortal: {
//         id: '2',
//         votingMachineChainId: '1',
//         votingMachine: '0x0000000000000000000000000000000000000000',
//         enabled: true,
//       },
//       votingConfig: {
//         id: '2',
//         cooldownBeforeVotingStart: '3600',
//         votingDuration: '86400',
//         yesThreshold: '0.5',
//         yesNoDifferential: '0.1',
//         minPropositionPower: '100',
//       },
//       payloads: [
//         {
//           id: '2_1',
//           chainId: '1',
//           accessLevel: 'public',
//           payloadsController: '0xControllerAddress2',
//         },
//       ],
//       transactions: {
//         id: '2',
//         created: {
//           id: '2',
//           blockNumber: 123457,
//           timestamp: 1633025800,
//         },
//         active: null,
//         queued: null,
//         failed: null,
//         executed: null,
//         canceled: null,
//       },
//       votingDuration: '86400',
//       snapshotBlockHash: '0x456',
//       votes: {
//         id: '2',
//         forVotes: '2000',
//         againstVotes: '200',
//       },
//       constants: {
//         id: '2',
//         precisionDivider: '1000000',
//         cooldownPeriod: '3600',
//         expirationTime: '172800',
//         cancellationFee: '10',
//       },
//     },
//     lifecycleState: 'Pending',
//     badgeState: 'Failed',
//     votingMachineData: {
//       proposalData: {
//         id: '2',
//         forVotes: '2000',
//         againstVotes: '200',
//       },
//     },
//     payloadsData: [],
//     votingInfo: {
//       forVotes: '2000',
//       againstVotes: '200',
//       totalVotes: '2200',
//     },
//   },
// ];

export const ProposalsV3List = () => {
  const [proposalFilter, setProposalFilter] = useState<string>('all');
  const filterState = stringToState(proposalFilter);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const { results: searchResults, loading: loadingSearchResults } = useProposalsSearch(searchTerm);

  const { data, isFetching: loadingProposals, fetchNextPage, hasNextPage } = useProposals();

  let listItems: Proposal[] = [];
  if (searchTerm && searchResults.length > 0) {
    listItems = searchResults;
  }

  if (!searchTerm && data) {
    data.pages.forEach((page) => listItems.push(...page.proposals));
  }

  if (proposalFilter !== 'all') {
    listItems = listItems.filter((proposal) => proposal.badgeState === filterState);
  }

  return (
    <Paper
      variant="elevation"
      sx={{
        mt: { xs: 4, sxm: 5 },
        py: { xs: 4, sxm: 9 },
        px: 4,
      }}
    >
      <ProposalListHeader
        proposalFilter={proposalFilter}
        handleProposalFilterChange={setProposalFilter}
        handleSearchQueryChange={setSearchTerm}
      />
      {listItems.length > 0 ? (
        <InfiniteScroll loadMore={() => fetchNextPage()} hasMore={hasNextPage}>
          {listItems.map((proposal) => (
            <ProposalV3ListItem key={proposal.subgraphProposal.id} proposal={proposal} />
          ))}
          {loadingProposals &&
            Array.from({ length: 5 }).map((_, i) => <ProposalListSkeleton key={i} />)}
        </InfiniteScroll>
      ) : ((!loadingSearchResults && searchTerm) ||
          (!loadingProposals && proposalFilter !== 'all')) &&
        listItems.length === 0 ? (
        <NoSearchResults searchTerm={searchTerm} />
      ) : (
        Array.from({ length: 4 }).map((_, i) => <ProposalListSkeleton key={i} />)
      )}
    </Paper>
  );
};

const ProposalListSkeleton = () => {
  return (
    <Box
      sx={{
        p: { xs: '24px 0', sxm: 6 },
        overflow: 'hidden',
        maxWidth: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        sx={{
          width: {
            xs: '100%',
            sxm: '80%',
          },
          pr: { xs: 0, sxm: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="column"
          sx={{
            width: {
              xs: '100%',
              sxm: '70%',
            },
            pr: { xs: 0, sxm: 8 },
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 3, sxm: 6 },
          }}
        >
          <Skeleton variant="rectangular" height={22} width={220} />
          <Skeleton variant="rectangular" height={24} width={350} />
        </Stack>
      </Stack>
      <Stack
        flexGrow={1}
        direction="column"
        justifyContent="center"
        sx={{
          pl: { xs: 0, sxm: 18 },
          mt: { xs: 7, sxm: 0 },
        }}
      >
        <VoteBar yae percent={0} votes={0} sx={{ mb: 4 }} loading />
        <VoteBar percent={0} votes={0} loading />
      </Stack>
    </Box>
  );
};
