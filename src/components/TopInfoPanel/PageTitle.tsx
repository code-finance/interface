import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

import { NetworkConfig } from '../../ui-config/networksConfig';
// import { BridgeButton } from '../BridgeButton';
import { MarketSwitcher } from '../MarketSwitcher';

export interface PageTitleProps extends Pick<NetworkConfig, 'bridge'> {
  pageTitle?: ReactNode;
  withMarketSwitcher?: boolean;
  withMigrateButton?: boolean;
  viewOnly?: boolean;
}

export const PageTitle = ({ pageTitle, withMarketSwitcher, viewOnly }: PageTitleProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', xsm: 'center' },
        mb: pageTitle ? { xs: 4, md: 10 } : 0,
        flexDirection: { xs: 'column', xsm: 'row' },
      }}
    >
      {pageTitle && !withMarketSwitcher && (
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Typography
            variant={'h1'}
            color="text.primary"
            sx={{
              mr: { xs: 5, xsm: 3 },
              mb: { xs: 1, xsm: 0 },
            }}
          >
            {pageTitle}
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {withMarketSwitcher && <MarketSwitcher viewOnly={viewOnly} />}
        {/* <BridgeButton bridge={bridge} variant="surface" withoutIcon={!upToMD} /> */}
        {/* NOTE:// Removing for now  */}
        {/*{isMigrateToV3Available && withMigrateButton && (*/}
        {/*  <Link href={ROUTES.migrationTool} sx={{ mt: { xs: 2, xsm: 0 } }}>*/}
        {/*    <Button variant="gradient" size="small">*/}
        {/*      <Trans>Migrate to V3</Trans>*/}
        {/*    </Button>*/}
        {/*  </Link>*/}
        {/*)}*/}
      </Box>
    </Box>
  );
};
