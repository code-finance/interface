import { Box, BoxProps, Container, ContainerProps } from '@mui/material';
import { ReactNode } from 'react';

import { PageTitle, PageTitleProps } from './PageTitle';

interface TopInfoPanelProps extends PageTitleProps {
  children?: ReactNode;
  titleComponent?: ReactNode;
  containerProps?: ContainerProps;
  multiMarket?: boolean;
  isGovernanceDetails?: boolean;
  wrapperSx?: BoxProps['sx'];
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
  wrapperSx,
}: TopInfoPanelProps) => {
  return (
    <Box
      sx={{
        bgcolor: isGovernanceDetails ? 'transparent' : 'background.top',
        pt: { xs: 10, md: 15 },
        pb: { xs: 18, md: 15 },
        ...wrapperSx,
      }}
    >
      <Container {...containerProps} sx={{ ...containerProps.sx, pb: 0 }}>
        <Box sx={{ py: { xs: 2, md: 3 }, px: { xs: 4, md: 0 } }}>
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
              justifyContent: 'space-between',
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
