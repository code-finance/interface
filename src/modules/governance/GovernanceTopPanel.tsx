import { Trans } from '@lingui/macro';
import CallMadeOutlinedIcon from '@mui/icons-material/CallMadeOutlined';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import * as React from 'react';
import { ChainAvailabilityText } from 'src/components/ChainAvailabilityText';
import { Link } from 'src/components/primitives/Link';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { TopInfoPanel } from '../../components/TopInfoPanel/TopInfoPanel';

interface ExternalLinkProps {
  text: string;
  href: string;
}

function ExternalLink({ text, href }: ExternalLinkProps) {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <Button
      variant="transparent"
      size="small"
      sx={{ px: 6, py: '9px' }}
      component={Link}
      href={href}
      target="_blank"
      rel="noopener"
      onClick={() => trackEvent(GENERAL.EXTERNAL_LINK, { Link: text })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {text}
        <SvgIcon sx={{ ml: 1, fontSize: 17 }}>
          <CallMadeOutlinedIcon />
        </SvgIcon>
      </Box>
    </Button>
  );
}

export const GovernanceTopPanel = () => {
  const trackEvent = useRootStore((store) => store.trackEvent);

  return (
    <TopInfoPanel
      titleComponent={
        <Box mb={4}>
          <ChainAvailabilityText page="Governance" wrapperSx={{ mb: 3 }} />
          <Typography color="text.secondary" variant="body3">
            <Trans>
              CODE is a fully decentralized, community governed protocol by the CODE token-holders.
              CODE token-holders collectively discuss, propose, and vote on upgrades to the
              protocol. CODE token-holders (Ethereum, kaia network only) can either vote themselves
              on new proposals or delegate to an address of choice. To learn more check out the
              Governance
            </Trans>{' '}
            <Link
              onClick={() => trackEvent(GENERAL.EXTERNAL_LINK, { Link: 'FAQ Docs Governance' })}
              href="https://docs.aave.com/faq/governance"
              sx={(theme) => ({
                textDecoration: 'underline',
                color: theme.palette.text.secondary,
                ...theme.typography.body3,
              })}
            >
              <Trans>documentation</Trans>
            </Link>
            .
          </Typography>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <ExternalLink text="SNAPSHOTS" href="https://snapshot.org/#/aave.eth" />
        <ExternalLink text="FORUM" href="https://governance.aave.com/" />
        <ExternalLink text="FAQ" href="https://docs.aave.com/faq/governance" />
      </Box>
    </TopInfoPanel>
  );
};
