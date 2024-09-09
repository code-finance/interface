import { Trans } from '@lingui/macro';
import ArrowOutward from '@mui/icons-material/ArrowOutward';
import { Box, Button, SvgIcon, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ListItem } from 'src/components/lists/ListItem';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { ActionDetails, ActionTextMap } from './actions/ActionDetails';
import { unixTimestampToFormattedTime } from './helpers';
import { ActionFields, TransactionHistoryItem } from './types';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';

function ActionTitle({ action }: { action: string }) {
  return (
    <Typography variant="body8" color="text.primary">
      <ActionTextMap action={action} />
    </Typography>
  );
}

interface TransactionHistoryItemProps {
  transaction: TransactionHistoryItem & ActionFields[keyof ActionFields];
}

function TransactionMobileRowItem({ transaction }: TransactionHistoryItemProps) {
  const [copyStatus, setCopyStatus] = useState(false);
  const { currentNetworkConfig, trackEvent } = useRootStore((state) => ({
    currentNetworkConfig: state.currentNetworkConfig,
    trackEvent: state.trackEvent,
  }));
  const theme = useTheme();

  useEffect(() => {
    if (copyStatus) {
      const timer = setTimeout(() => {
        setCopyStatus(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [copyStatus]);

  const explorerLink = currentNetworkConfig.explorerLinkBuilder({ tx: transaction.txHash });

  return (
    <Box>
      <ListItem
        px={0}
        sx={{
          borderWidth: `1px 0 0 0`,
          borderStyle: `solid`,
          borderColor: `${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'left',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              pt: '14px',
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ActionTitle action={transaction.action} />
            </Box>

            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body5" color="text.mainTitle">
                {unixTimestampToFormattedTime({ unixTimestamp: transaction.timestamp })}
              </Typography>
            </Box>
          </Box>
          <Button
            sx={(theme) => ({
              height: '34px',
              width: '137px',
              ...theme.typography.body4,
              textTransform: 'unset',
              mt: 1.5,
              alignSelf: 'flex-end',
            })}
            variant="transparent"
            href={explorerLink}
            target="_blank"
            onClick={() =>
              trackEvent(GENERAL.EXTERNAL_LINK, { funnel: 'TxHistoy', Link: 'Etherscan' })
            }
          >
            <Trans>Explorer</Trans>
            <CallMadeOutlinedIcon fontSize={'small'} sx={{ ml: 1 }} />
          </Button>
          <Box sx={{ pt: 4, pb: '14px' }}>
            <ActionDetails transaction={transaction} iconSize="24px" />
          </Box>
        </Box>
      </ListItem>
    </Box>
  );
}

export default TransactionMobileRowItem;
