import { Box, Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
}

export const TopInfoPanel = ({
  pageTitle,
  titleComponent,
  withMarketSwitcher,
  withMigrateButton,
  bridge,
  children,
  containerProps = {},
}: TopInfoPanelProps) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.top',
        pt: { xs: 10, md: 20 },
        pb: { xs: 18, md: 15 },
      }}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, py: 0 }}>
        <Box sx={{ py: 3 }}>
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
              gap: { xs: 3, xsm: 8 },
              flexWrap: 'wrap',
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
