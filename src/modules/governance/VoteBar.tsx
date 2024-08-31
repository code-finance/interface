import { Trans } from '@lingui/macro';
import { Box, BoxProps, experimental_sx, Skeleton, styled, Typography } from '@mui/material';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';

const OuterBar = styled('div')(({ theme }) =>
  experimental_sx({
    position: 'relative',
    width: '100%',
    height: '12px',
    display: 'block',
    borderRadius: '6px',
    backgroundColor: theme.palette.background.tertiary,
  })
);

const InnerBar = styled('span')<{ percent: number; yae?: boolean }>(({ theme, percent, yae }) =>
  experimental_sx({
    position: 'absolute',
    top: 0,
    left: 0,
    width: `${percent * 100}%`,
    maxWidth: '100%',
    height: '12px',
    backgroundColor: yae ? theme.palette.point.positive : theme.palette.point.negative,
    display: 'block',
    borderRadius: '6px',
  })
);

interface VoteBarProps extends BoxProps {
  votes: number;
  percent: number;
  yae?: boolean;
  loading?: boolean;
  compact?: boolean;
}

export function VoteBar({ percent, yae, votes, loading, compact, ...rest }: VoteBarProps) {
  return (
    <Box {...rest}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <Typography sx={{ mr: 1 }} variant="detail2" color="text.primary">
          {yae ? <Trans>YAE</Trans> : <Trans>NAY</Trans>}
        </Typography>
        {loading ? (
          <Typography variant="detail2" sx={{ flexGrow: 1, lineHeight: '1rem' }}>
            <Skeleton width={40} />
          </Typography>
        ) : (
          <Box component="span" sx={{ flexGrow: 1 }}>
            <FormattedNumber
              value={votes}
              visibleDecimals={0}
              sx={{ mr: 1 }}
              variant="detail2"
              color="text.primary"
              roundDown
              compact={compact}
            />
            {/* {!compact && (
              <Typography component="span" variant="detail2" color="text.primary">
                CODE
              </Typography>
            )} */}
          </Box>
        )}
        {loading ? (
          <Typography variant="caption">
            <Skeleton width={40} />
          </Typography>
        ) : (
          <FormattedNumber value={percent} percent variant="detail3" color="text.mainTitle" />
        )}
      </Box>
      {loading ? (
        <Skeleton variant="rectangular" height={8} sx={{ borderRadius: '6px' }} />
      ) : (
        <OuterBar>
          <InnerBar percent={percent} yae={yae} />
        </OuterBar>
      )}
    </Box>
  );
}
