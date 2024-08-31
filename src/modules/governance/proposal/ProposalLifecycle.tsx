import { PayloadState, ProposalV3State, VotingMachineProposalState } from '@aave/contract-helpers';
import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import CallMadeIcon from '@mui/icons-material/CallMade';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from '@mui/lab';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';
import { DarkTooltip } from 'src/components/infoTooltips/DarkTooltip';
import { Link } from 'src/components/primitives/Link';
import { Proposal } from 'src/hooks/governance/useProposals';
import { useRootStore } from 'src/store/root';
import { governanceV3Config } from 'src/ui-config/governanceConfig';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

import {
  getLifecycleStateTimestamp,
  getPayloadStateTimestamp,
  getProposalStateTimestamp,
  getVotingMachineProposalStateTimestamp,
  ProposalLifecycleStep,
} from '../utils/formatProposal';

export const ProposalLifecycle = ({ proposal }: { proposal: Proposal | undefined }) => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  if (proposal === undefined) {
    return <></>; // TODO: skeleton
  }

  const createdPayloadOrder = proposal.payloadsData.sort((a, b) => a.createdAt - b.createdAt);

  const coreNetworkConfig = getNetworkConfig(governanceV3Config.coreChainId);
  const votingNetworkConfig = getNetworkConfig(
    +proposal.subgraphProposal.votingPortal.votingMachineChainId
  );

  const filterProposalNotCancelled = (step: ProposalStepProps) => {
    return !(
      proposal.subgraphProposal.transactions.canceled &&
      +step.timestamp >= +proposal.subgraphProposal.transactions.canceled.timestamp
    );
  };

  const filterProposalNotFailed = (step: ProposalStepProps) => {
    return !(
      proposal.subgraphProposal.transactions.failed &&
      +step.timestamp >= +proposal.subgraphProposal.transactions.failed.timestamp
    );
  };

  const proposalCreatedSubsteps = createdPayloadOrder
    .map<ProposalStepProps>((payload) => {
      const networkConfig = getNetworkConfig(payload.chainId);
      return {
        completed: true,
        active: proposal.lifecycleState === ProposalLifecycleStep.Created,
        stepName: `Payload ${payload.id} was created`,
        timestamp: payload.createdAt,
        networkLogo: networkConfig.networkLogoPath,
      };
    })
    .concat([
      {
        completed: true,
        active: proposal.lifecycleState === ProposalLifecycleStep.Created,
        stepName: `Proposal was created`,
        timestamp: getProposalStateTimestamp(ProposalV3State.Created, proposal),
        lastStep: true,
        transactionHash: coreNetworkConfig.explorerLinkBuilder({
          tx: proposal.subgraphProposal.transactions.created.id,
        }),
        networkLogo: coreNetworkConfig.networkLogoPath,
      },
    ]);

  const proposalOpenForVotingSubstates = [
    {
      completed: proposal.subgraphProposal.state >= ProposalV3State.Active,
      active: proposal.lifecycleState === ProposalLifecycleStep.OpenForVoting,
      stepName: `Proposal was activated for voting`,
      timestamp: getProposalStateTimestamp(ProposalV3State.Active, proposal),
      transactionHash: proposal.subgraphProposal.transactions.active
        ? coreNetworkConfig.explorerLinkBuilder({
            tx: proposal.subgraphProposal.transactions.active?.id,
          })
        : undefined,
      networkLogo: coreNetworkConfig.networkLogoPath,
    },
    {
      completed: proposal.votingMachineData.state >= VotingMachineProposalState.Active,
      active: proposal.lifecycleState === ProposalLifecycleStep.OpenForVoting,
      stepName: `Voting started`,
      timestamp: getVotingMachineProposalStateTimestamp(
        VotingMachineProposalState.Active,
        proposal
      ),
      lastStep: true,
      networkLogo: votingNetworkConfig.networkLogoPath,
    },
  ];

  const payloadsExecutedSubstates = [
    {
      completed: proposal.subgraphProposal.state > ProposalV3State.Queued,
      active: proposal.subgraphProposal.state === ProposalV3State.Queued,
      stepName: `Proposal queued`,
      timestamp: getProposalStateTimestamp(ProposalV3State.Queued, proposal),
      networkLogo: coreNetworkConfig.networkLogoPath,
    },
    {
      completed: proposal.subgraphProposal.state >= ProposalV3State.Executed,
      active: proposal.subgraphProposal.state === ProposalV3State.Queued,
      stepName: `Proposal executed`,
      timestamp: getProposalStateTimestamp(ProposalV3State.Executed, proposal),
      networkLogo: coreNetworkConfig.networkLogoPath,
    },
  ]
    .concat(
      proposal.payloadsData.map((payload) => {
        const networkConfig = getNetworkConfig(payload.chainId);
        return {
          completed: payload.state >= PayloadState.Queued,
          active:
            proposal.subgraphProposal.state === ProposalV3State.Executed &&
            payload.state === PayloadState.Queued,
          stepName: `Payload ${payload.id} queued`,
          timestamp: payload.queuedAt
            ? payload.queuedAt
            : getPayloadStateTimestamp(PayloadState.Queued, payload, proposal),
          networkLogo: networkConfig.networkLogoPath,
        };
      })
    )
    .concat(
      proposal.payloadsData.map((payload, index) => {
        const networkConfig = getNetworkConfig(payload.chainId);
        return {
          completed: payload.state >= PayloadState.Executed,
          active: payload.state === PayloadState.Queued,
          stepName: `Payload ${payload.id} executed`,
          timestamp: payload.executedAt
            ? payload.executedAt
            : getPayloadStateTimestamp(PayloadState.Executed, payload, proposal),
          lastStep: index === proposal.payloadsData.length - 1,
          networkLogo: networkConfig.networkLogoPath,
        };
      })
    );

  const urlRegex = /https?:\/\/[^\s"]+/g;
  const discussionUrl = proposal.subgraphProposal.proposalMetadata.discussions.match(urlRegex);

  const proposalSteps: ProposalStepProps[] = [
    {
      completed: proposal.lifecycleState > ProposalLifecycleStep.Created,
      active: proposal.lifecycleState === ProposalLifecycleStep.Created,
      stepName: 'Created',
      timestamp: getLifecycleStateTimestamp(ProposalLifecycleStep.Created, proposal),
      substeps: proposalCreatedSubsteps,
    },
    {
      completed: proposal.lifecycleState > ProposalLifecycleStep.OpenForVoting,
      active: proposal.lifecycleState === ProposalLifecycleStep.OpenForVoting,
      stepName: 'Open for voting',
      timestamp: getLifecycleStateTimestamp(ProposalLifecycleStep.OpenForVoting, proposal),
      substeps: proposalOpenForVotingSubstates,
    },
    {
      completed: proposal.subgraphProposal.state >= ProposalV3State.Queued,
      active: proposal.lifecycleState === ProposalLifecycleStep.VotingClosed,
      stepName: 'Voting closed',
      timestamp: getLifecycleStateTimestamp(ProposalLifecycleStep.VotingClosed, proposal),
    },
    {
      completed: proposal.lifecycleState === ProposalLifecycleStep.Executed,
      active: proposal.lifecycleState >= ProposalLifecycleStep.VotingClosed,
      stepName: 'Payloads executed',
      timestamp: getLifecycleStateTimestamp(ProposalLifecycleStep.Executed, proposal),
      substeps: payloadsExecutedSubstates,
      lastStep: true,
    },
  ]
    .filter(filterProposalNotCancelled)
    .filter(filterProposalNotFailed);

  if (proposal.subgraphProposal.transactions.canceled) {
    proposalSteps.push({
      completed: true,
      active: false,
      stepName: 'Cancelled',
      timestamp: +proposal.subgraphProposal.transactions.canceled.timestamp,
      lastStep: true,
    });
  }

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h2" color="text.primary" mb="32px">
        <Trans>Proposal details</Trans>
      </Typography>
      <Timeline
        position="right"
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          p: '0px 0px 0px 20px',
          my: 0,
        }}
      >
        {proposalSteps.map((elem) => (
          <ProposalStep key={elem.stepName} {...elem} />
        ))}
      </Timeline>
      {discussionUrl && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{
              pl: '24px',
              pr: '20px',
              py: '10px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'border.contents',
            }}
            component={Link}
            target="_blank"
            rel="noopener"
            onClick={() =>
              trackEvent(GENERAL.EXTERNAL_LINK, {
                AIP: proposal.subgraphProposal.id,
                Link: 'Forum Discussion',
              })
            }
            href={discussionUrl[0]}
            variant="surface"
          >
            <Typography variant="body4" color="text.secondary">
              <Trans>Forum discussion</Trans>
            </Typography>
            <CallMadeIcon sx={{ width: '24px', height: '24px', ml: 1, color: 'text.secondary' }} />
          </Button>
        </Box>
      )}
    </Box>
  );
};
const formatTime = (timestamp: number) => {
  return dayjs.unix(timestamp).format('MMM D, YYYY h:mm A');
};

interface ProposalStepProps {
  stepName: string;
  timestamp: number;
  lastStep?: boolean;
  completed?: boolean;
  active?: boolean;
  substeps?: ProposalStepProps[];
  transactionHash?: string;
  networkLogo?: string;
}

const ProposalStep = ({
  stepName,
  timestamp,
  lastStep,
  completed,
  active,
  substeps,
  transactionHash,
  networkLogo,
}: ProposalStepProps) => {
  const theme = useTheme();
  const [subtimelineOpen, setSubtimelineOpen] = useState(false);

  const toggleSubtimeline = () => {
    setSubtimelineOpen((open) => !open);
  };

  return (
    <TimelineItem>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            width: '16px',
            height: '16px',
            background: completed
              ? theme.palette.point.primary
              : active
              ? 'white'
              : theme.palette.text.disabled,
            borderColor: completed || active ? theme.palette.primary.main : 'none',
            my: 1,
          }}
          variant={active ? 'outlined' : 'filled'}
        />
        {!lastStep && (
          <TimelineConnector
            sx={{
              background: theme.palette.text.disabled,
              width: '1px',
              color: 'text.subTitle',
            }}
          />
        )}
      </TimelineSeparator>
      <TimelineContent sx={{ p: '0px 0px 0px 20px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', pt: 0 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {networkLogo && <Avatar sx={{ width: 16, height: 16, mr: 2 }} src={networkLogo} />}
              <Typography variant="body2" mb="6px">
                <Trans>{stepName}</Trans>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: '28px' }}>
              <Typography variant="detail2" color="text.mainTitle">
                {formatTime(timestamp)}
              </Typography>
              {transactionHash && (
                <DarkTooltip title="View on explorer">
                  <Link href={transactionHash} target="_blank" sx={{ display: 'flex' }}>
                    <SvgIcon sx={{ fontSize: 12 }}>
                      <ExternalLinkIcon />
                    </SvgIcon>
                  </Link>
                </DarkTooltip>
              )}
            </Box>
          </Box>
          {substeps && (
            <IconButton
              sx={{ width: '24px', height: '24px', p: 0, ml: 'auto', color: 'text.secondary' }}
              onClick={toggleSubtimeline}
            >
              {subtimelineOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
        </Box>
        {substeps && subtimelineOpen && (
          <Timeline sx={{ py: 0 }}>
            {substeps.map((elem) => (
              <ProposalStep key={elem.stepName?.toString()} {...elem} />
            ))}
          </Timeline>
        )}
      </TimelineContent>
    </TimelineItem>
  );
};
