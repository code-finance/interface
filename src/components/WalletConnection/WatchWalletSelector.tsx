import { Trans } from '@lingui/macro';
import { Box, Button, InputBase, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import { utils } from 'ethers';
import { useEffect, useState } from 'react';
import { ReadOnlyModeTooltip } from 'src/components/infoTooltips/ReadOnlyModeTooltip';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useRootStore } from 'src/store/root';
import { getENSProvider } from 'src/utils/marketsAndNetworksConfig';
import { AUTH } from 'src/utils/mixPanelEvents';

import { Warning } from '../primitives/Warning';

export enum ErrorType {
  UNSUPORTED_CHAIN,
  USER_REJECTED_REQUEST,
  UNDETERMINED_ERROR,
  NO_WALLET_DETECTED,
}

export const WatchWalletSelector = () => {
  const { error, connectReadOnlyMode } = useWeb3Context();
  const [inputMockWalletAddress, setInputMockWalletAddress] = useState('');
  const [validAddressError, setValidAddressError] = useState<boolean>(false);
  const { breakpoints } = useTheme();
  const sm = useMediaQuery(breakpoints.down('sm'));
  const mainnetProvider = getENSProvider();
  const [unsTlds, setUnsTlds] = useState<string[]>([]);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const blockingError: ErrorType | undefined = undefined;

  // Get UNS Tlds. Grabbing this fron an endpoint since Unstoppable adds new TLDs frequently, so this wills tay updated
  useEffect(() => {
    const unsTlds = async () => {
      const url = 'https://resolve.unstoppabledomains.com/supported_tlds';
      const response = await fetch(url);
      const data = await response.json();
      setUnsTlds(data['tlds']);
    };

    try {
      unsTlds();
    } catch (e) {
      console.log('Error fetching UNS TLDs: ', e);
    }
  }, []);

  const handleBlocking = () => {
    if (!blockingError) return null;
    switch (blockingError) {
      case ErrorType.UNSUPORTED_CHAIN:
        return <Trans>Network not supported for this wallet</Trans>;
      case ErrorType.USER_REJECTED_REQUEST:
        return <Trans>Rejected connection request</Trans>;
      case ErrorType.NO_WALLET_DETECTED:
        return <Trans>Wallet not detected. Connect or install wallet and retry</Trans>;
      default:
        console.log('Uncatched error: ', error);
        return <Trans>Error connecting. Try refreshing the page.</Trans>;
    }
  };

  const handleReadAddress = async (inputMockWalletAddress: string): Promise<void> => {
    if (validAddressError) setValidAddressError(false);
    if (utils.isAddress(inputMockWalletAddress)) {
      connectReadOnlyMode(inputMockWalletAddress);
    } else {
      // Check if address could be valid ENS before trying to resolve
      if (inputMockWalletAddress.slice(-4) === '.eth') {
        // Attempt to resolve ENS name and use resolved address if valid
        const resolvedAddress = await mainnetProvider.resolveName(inputMockWalletAddress);
        if (resolvedAddress && utils.isAddress(resolvedAddress)) {
          connectReadOnlyMode(resolvedAddress);
        } else {
          setValidAddressError(true);
        }
      } else if (unsTlds.includes(inputMockWalletAddress.split('.').pop() as string)) {
        // Handle UNS names
        const url = 'https://resolve.unstoppabledomains.com/domains/' + inputMockWalletAddress;
        const options = {
          method: 'GET',
          headers: { Authorization: 'Bearer 01f60ca8-2dc3-457d-b12e-95ac2a7fb517' },
        };
        const response = await fetch(url, options);
        const data = await response.json();
        const resolvedAddress = data['meta']['owner'];
        if (resolvedAddress && utils.isAddress(resolvedAddress)) {
          connectReadOnlyMode(resolvedAddress);
        } else {
          setValidAddressError(true);
        }
      } else {
        setValidAddressError(true);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    handleReadAddress(inputMockWalletAddress);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Typography
        // variant="h2"
        sx={{
          fontSize: '17px',
          textAlign: 'center',
          mb: 6,
          lineHeight: '20px',
          fontWeight: '600',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        Watch a wallet
      </Typography>
      {error && <Warning severity="error">{handleBlocking()}</Warning>}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, padding: '10px 0' }}>
        <Typography variant="subheader1" color="text.secondary">
          <Trans>Track wallet balance in read-only mode</Trans>
        </Typography>
        <ReadOnlyModeTooltip />
      </Box>
      <form onSubmit={handleSubmit}>
        <InputBase
          sx={(theme) => ({
            py: 1,
            px: 3,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '6px',
            mb: 1,
            overflow: 'show',
            fontSize: sm ? '16px' : '14px',
          })}
          placeholder="Enter ethereum address or username"
          fullWidth
          value={inputMockWalletAddress}
          onChange={(e) => setInputMockWalletAddress(e.target.value)}
          inputProps={{
            'aria-label': 'read-only mode address',
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            mb: '8px',
          }}
          size="large"
          fullWidth
          onClick={() => trackEvent(AUTH.MOCK_WALLET)}
          disabled={
            !utils.isAddress(inputMockWalletAddress) &&
            inputMockWalletAddress.slice(-4) !== '.eth' &&
            !unsTlds.includes(inputMockWalletAddress.split('.').pop() as string)
          }
          aria-label="read-only mode address"
        >
          <Trans>Track wallet</Trans>
        </Button>
      </form>
      {validAddressError && (
        <Typography variant="helperText" color="error.main">
          <Trans>Please enter a valid wallet address.</Trans>
        </Typography>
      )}
      <Typography variant="description" sx={{ mt: '22px', mb: '30px', alignSelf: 'center' }}>
        <Trans>
          Need help connecting a wallet?{' '}
          <Link href="https://docs.aave.com/faq/troubleshooting" target="_blank" rel="noopener">
            Read our FAQ
          </Link>
        </Trans>
      </Typography>
      <Typography variant="helperText">
        <Trans>
          Wallets are provided by External Providers and by selecting you agree to Terms of those
          Providers. Your access to the wallet might be reliant on the External Provider being
          operational.
        </Trans>
      </Typography>
    </Box>
  );
};