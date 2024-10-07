import { Trans } from '@lingui/macro';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';
import { ContentContainer } from 'src/components/ContentContainer';
import { TopInfoPanel } from 'src/components/TopInfoPanel/TopInfoPanel';
import { MainLayout } from 'src/layouts/MainLayout';
import { useRootStore } from 'src/store/root';

export default function Aave404Page() {
  const theme = useTheme();
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': '404 Error',
    });
  }, [trackEvent]);
  return (
    <>
      <TopInfoPanel />
      <ContentContainer>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: '100px 40px',
            flex: 1,
            backgroundColor: theme.palette.background.primary,
          }}
        >
          <Box sx={{ maxWidth: 444, m: '0 auto' }}>
            <img width="100%" height="auto" src="/404/404.svg" alt="404 - Page not found" />
          </Box>
          <Typography variant="body8" sx={{ mt: '32px', color: 'text.secondary' }}>
            <Trans>Page not found</Trans>
          </Typography>
          <Typography
            variant="body8"
            sx={{ mt: '24px', mb: '40px', color: 'text.secondary', maxWidth: 480 }}
          >
            <Trans>Sorry, we couldn&apos;t find the page you were looking for.</Trans>
            <br />
            <Trans>We suggest you go back to the Dashboard.</Trans>
          </Typography>
          <Link href="/" passHref>
            <Button
              sx={{ padding: '12px 60px', maxHeight: '45px' }}
              variant="outlined"
              color="primary"
            >
              <Typography variant="body7">
                <Trans>Back to Dashboard</Trans>
              </Typography>
            </Button>
          </Link>
        </Paper>
      </ContentContainer>
    </>
  );
}

Aave404Page.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
