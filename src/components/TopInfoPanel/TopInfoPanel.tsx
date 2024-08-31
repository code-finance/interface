import { Box, Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
  multiMarket?: boolean;
  isGovernanceDetails?: boolean;
}

export const TopInfoPanel = ({
  pageTitle,
  titleComponent,
  withMarketSwitcher,
  withMigrateButton,
  bridge,
  multiMarket,
  children,
  containerProps = {},
  isGovernanceDetails,
}: TopInfoPanelProps) => {
  return (
    <Box
      sx={{
        bgcolor: isGovernanceDetails ? 'transparent' : 'background.top',
        pt: { xs: 10, md: 20 },
        pb: { xs: 18, md: 15 },
      }}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0 }}>
        <Box sx={{ px: { xs: 4, xsm: 0 }, py: 3 }}>
          {!titleComponent && (
            <PageTitle
              pageTitle={pageTitle}
              withMarketSwitcher={withMarketSwitcher}
              withMigrateButton={withMigrateButton}
              bridge={bridge}
            />
          )}

          {titleComponent && titleComponent}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: { xs: 3, xsm: 5 },
              flexWrap: 'wrap',
              width: '100%',
              ...(multiMarket && { flexDirection: 'column' }),
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
