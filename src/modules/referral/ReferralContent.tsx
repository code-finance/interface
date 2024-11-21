import { Trans } from '@lingui/macro';
import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { ConnectWalletPaperReferral } from 'src/components/ConnectWalletPaperReferral';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { ReferralInforTable } from './ReferralInforTable';
import { ReferralProgramDetails } from './ReferralProgramDetails';

export const ReferralContent = () => {
  const { currentAccount, loading } = useWeb3Context();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const isValidNetWorkWallet = true;
  const [searchTerm, setSearchTerm] = useState<string>('');
  return (
    <Box>
      {currentAccount && !loading ? (
        isValidNetWorkWallet ? (
          <Container sx={{ px: '0 !important' }}>
            <ReferralInforTable />
            <ReferralProgramDetails
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              setSearchTerm={setSearchTerm}
            />
          </Container>
        ) : (
          <ConnectWalletPaperReferral
            isSwitchWallet
            titleHeader={<Trans>The connected wallet doesn’t support referral program.</Trans>}
            description={
              <Trans>
                Please connect an Ethereum, Kaia, TON wallet to participate in the referral program.
              </Trans>
            }
            loading={loading}
          />
        )
      ) : (
        <ConnectWalletPaperReferral
          titleHeader={<Trans>Please connect a wallet</Trans>}
          description={<Trans>Connect a wallet to check the referral program. </Trans>}
          loading={loading}
        />
      )}
    </Box>
  );
};
