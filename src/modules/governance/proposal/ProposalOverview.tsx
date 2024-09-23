import { DownloadIcon } from '@heroicons/react/solid';
import { Trans } from '@lingui/macro';
import { Twitter } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Paper,
  Skeleton,
  styled,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LensIcon } from 'src/components/icons/LensIcon';
import { Warning } from 'src/components/primitives/Warning';
import { Proposal } from 'src/hooks/governance/useProposals';
// import { FormattedProposalTime } from 'src/modules/governance/FormattedProposalTime';
import { StateBadge } from 'src/modules/governance/StateBadge';
// import { IpfsType } from 'src/static-build/ipfs';
// import { CustomProposalType } from 'src/static-build/proposal';
import { useRootStore } from 'src/store/root';
import { ipfsGateway } from 'src/ui-config/governanceConfig';
import { GENERAL } from 'src/utils/mixPanelEvents';

const CenterAlignedImage = styled('img')({
  display: 'block',
  margin: '0 auto',
  maxWidth: '100%',
});

const StyledLink = styled('a')({
  color: 'inherit',
  textDecoration: 'none',
});

interface ProposalOverviewProps {
  error: boolean;
  proposal?: Proposal;
  loading: boolean;
}

export const ProposalOverview = ({ proposal, loading, error }: ProposalOverviewProps) => {
  const trackEvent = useRootStore((store) => store.trackEvent);
  const { breakpoints, palette } = useTheme();
  const lgUp = useMediaQuery(breakpoints.up('lg'));
  const xsm = useMediaQuery(breakpoints.up('xsm'));

  return (
    <Paper
      sx={{
        py: { xs: 5, xsm: 9 },
        px: 4,
        mt: xsm ? 5 : 4,
      }}
      data-cy="vote-info-body"
    >
      <Typography variant={'h2'} color="text.secondary" sx={{ mb: { xs: 6, xsm: 10 } }}>
        <Trans> Proposal overview</Trans>
      </Typography>
      <Divider />
      {error ? (
        <Box>
          <Warning severity="error">
            <Trans>An error has occurred fetching the proposal.</Trans>
          </Warning>
        </Box>
      ) : (
        <Box sx={{ wordBreak: 'break-word' }}>
          {proposal ? (
            <Box>
              <Box sx={{ my: { xs: 7, xsm: 10 } }}>
                <Typography variant="h5" sx={{ mb: xsm ? '20px' : '12px', color: 'text.primary' }}>
                  {proposal.subgraphProposal.proposalMetadata.title || <Skeleton />}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <StateBadge
                        wrapperSx={{ px: '12px', py: xsm ? '10px' : '6px' }}
                        state={proposal.badgeState}
                        loading={loading}
                      />
                      {/* <Button
                        sx={{
                          px: '12px',
                          py: '10px',
                          color: theme.palette.point.positive,
                          borderColor: theme.palette.point.positive,
                        }}
                      >
                        <Typography variant="body4">
                          <Trans>Open for Voting</Trans>
                        </Typography>
                      </Button> */}
                    </Box>
                    {/*
                     !loading && (
                       <FormattedProposalTime
                         state={proposal.state}
                         executionTime={proposal.executionTime}
                         startTimestamp={proposal.startTimestamp}
                         executionTimeWithGracePeriod={proposal.executionTimeWithGracePeriod}
                         expirationTimestamp={proposal.expirationTimestamp}
                       />
                       )
                       */}
                  </Box>
                  <Button
                    component="a"
                    sx={{
                      minWidth: lgUp ? '160px' : '',
                      px: '12px',
                      py: '8px',
                      border: 'none',
                      '&:hover': { border: 'none', backgroundColor: 'transparent' },
                      color: 'text.secondary',
                    }}
                    target="_blank"
                    rel="noopener"
                    onClick={() =>
                      trackEvent(GENERAL.EXTERNAL_LINK, {
                        AIP: proposal.subgraphProposal.id,
                        Link: 'Raw Ipfs',
                      })
                    }
                    href={`${ipfsGateway}/${proposal.subgraphProposal.proposalMetadata.ipfsHash}`}
                    startIcon={
                      <SvgIcon sx={{ '& path': { strokeWidth: '1' } }}>
                        <DownloadIcon />
                      </SvgIcon>
                    }
                  >
                    {lgUp && (
                      <Typography variant="body4">
                        <Trans>Raw-Ipfs</Trans>
                      </Typography>
                    )}
                  </Button>
                  {/* <Button
                    component="a"
                    sx={{ minWidth: lgUp ? '160px' : '' }}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent(GENERAL.EXTERNAL_LINK, {
                        AIP: proposal.subgraphProposal.id,
                        Link: 'Share on twitter',
                      })
                    }
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      proposal.subgraphProposal.proposalMetadata.title
                    )}&url=${window.location.href}`}
                    startIcon={<Twitter />}
                  >
                    {lgUp && <Trans>Share on twitter</Trans>}
                  </Button>
                  <Button
                    sx={{ minWidth: lgUp ? '160px' : '' }}
                    component="a"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent(GENERAL.EXTERNAL_LINK, {
                        AIP: proposal.subgraphProposal.id,
                        Link: 'Share on lens',
                      })
                    }
                    href={`https://hey.xyz/?url=${window.location.href}&text=Check out this proposal on aave governance 👻👻 - ${proposal.subgraphProposal.proposalMetadata.title}&hashtags=Aave&preview=true`}
                    startIcon={
                      <LensIcon
                        color={palette.mode === 'dark' ? palette.primary.light : palette.text.primary}
                      />
                    }
                  >
                    {lgUp && <Trans>Share on Lens</Trans>}
                  </Button> */}
                </Box>
              </Box>
              <Divider />
            </Box>
          ) : (
            <Typography variant="buttonL">
              <Skeleton />
            </Typography>
          )}
          {proposal ? (
            <Box sx={{ px: '8px' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table({ node, ...props }) {
                    return (
                      <TableContainer
                        component={Paper}
                        variant="outlined"
                        sx={{ my: 4, boxShadow: 'unset', borderRadius: 2 }}
                      >
                        <Table {...props} sx={{ wordBreak: 'normal' }} />
                      </TableContainer>
                    );
                  },
                  tr({ node, ...props }) {
                    return (
                      <TableRow
                        // sx={{ '&:last-child td, &:last-child th': { border: 0 }, mt: '16px' }}
                        {...props}
                      />
                    );
                  },
                  td({ children, style }) {
                    return (
                      <TableCell style={style} sx={(theme) => ({ ...theme.typography.detail2 })}>
                        {children}
                      </TableCell>
                    );
                  },
                  th({ children, style }) {
                    return <TableCell style={style}>{children}</TableCell>;
                  },
                  tbody({ children }) {
                    return <TableBody>{children}</TableBody>;
                  },
                  thead({ node, ...props }) {
                    return <TableHead {...props} />;
                  },
                  ul({ children, style }) {
                    return (
                      <ul
                        style={{
                          paddingLeft: '10px',
                          marginLeft: '10px',
                          ...style,
                        }}
                      >
                        {children}
                      </ul>
                    );
                  },
                  img({ src: _src, alt }) {
                    if (!_src) return null;
                    const src = /^\.\.\//.test(_src)
                      ? _src.replace(
                          '../',
                          'https://raw.githubusercontent.com/aave/aip/main/content/'
                        )
                      : _src;
                    return <CenterAlignedImage src={src} alt={alt} />;
                  },
                  a({ node, ...rest }) {
                    return <StyledLink {...rest} />;
                  },
                  h2({ node, ...rest }) {
                    return (
                      <Typography
                        component="div"
                        variant={'h3'}
                        mt={xsm ? 10 : 6}
                        mb={xsm ? 4 : 3}
                        gutterBottom
                        {...rest}
                      />
                    );
                  },
                  p({ node, ...rest }) {
                    return <Typography variant={'body2'} {...rest} component="div" />;
                  },
                  li({ node, ...rest }) {
                    return (
                      <li>
                        <Typography variant={'body2'} px={0} {...rest} />
                      </li>
                    );
                  },
                }}
              >
                {proposal.subgraphProposal.proposalMetadata.description}
              </ReactMarkdown>
            </Box>
          ) : (
            <>
              <Skeleton variant="text" sx={{ my: 4 }} />
              <Skeleton variant="rectangular" height={200} sx={{ my: 4 }} />
              <Skeleton variant="text" sx={{ my: 4 }} />
              <Skeleton variant="rectangular" height={400} sx={{ my: 4 }} />
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};
