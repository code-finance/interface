import { InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { WalletIcon } from 'src/components/icons/WalletIcon';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Base64Token, TokenIcon } from 'src/components/primitives/TokenIcon';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';

import { BaseSuccessView } from './BaseSuccess';

export type SuccessTxViewProps = {
  txHash?: string;
  action?: ReactNode;
  amount?: string;
  symbol?: string;
  collateral?: boolean;
  rate?: InterestRate;
  addToken?: ERC20TokenType;
  customAction?: ReactNode;
  customText?: ReactNode;
};

export const TxSuccessView = ({
  txHash,
  action,
  amount,
  symbol,
  collateral,
  rate,
  addToken,
  customAction,
  customText,
}: SuccessTxViewProps) => {
  const { addERC20Token } = useWeb3Context();
  const [base64, setBase64] = useState('');
  const theme = useTheme();

  return (
    <BaseSuccessView txHash={txHash}>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {action && amount && symbol && (
          <Typography variant="body5" color="text.secondary">
            <Trans>
              You {action}{' '}
              <FormattedNumber
                value={Number(amount)}
                compact
                variant="body5"
                color="text.secondary"
                symbolsVariant="body5"
                symbolsColor="text.secondary"
              />{' '}
              {symbol}
            </Trans>
          </Typography>
        )}

        {customAction && (
          <Typography variant="body5" color="text.secondary">
            {customText}
            {customAction}
          </Typography>
        )}

        {!action && !amount && symbol && (
          <Typography variant="body5" color="text.secondary">
            Your {symbol} {collateral ? 'now' : 'is not'} used as collateral
          </Typography>
        )}

        {rate && (
          <Typography variant="body5" color="text.secondary">
            <Trans>
              You switched to {rate === InterestRate.Variable ? 'variable' : 'stable'} rate
            </Trans>
          </Typography>
        )}

        {addToken && symbol && (
          <Box
            sx={(theme) => ({
              background: theme.palette.background.secondary,
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 6,
              width: '100%',
              py: 4,
              px: 3,
            })}
          >
            <TokenIcon
              symbol={addToken.symbol}
              aToken={addToken && addToken.aToken ? true : false}
              sx={{ fontSize: '36px', mb: '12px' }}
            />
            <Typography variant="body7" color="text.secondary">
              <Trans>
                Add {addToken && addToken.aToken ? 'aToken ' : 'token '} to wallet to track your
                balance.
              </Trans>
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                addERC20Token({
                  address: addToken.address,
                  decimals: addToken.decimals,
                  symbol: addToken.aToken ? '' : addToken.symbol,
                  image: !/_/.test(addToken.symbol) ? base64 : undefined,
                });
              }}
              sx={{ height: '36px', px: 2, mt: 3 }}
            >
              {addToken.symbol && !/_/.test(addToken.symbol) && (
                <Base64Token
                  symbol={addToken.symbol}
                  onImageGenerated={setBase64}
                  aToken={addToken.aToken}
                />
              )}
              <WalletIcon sx={{ width: '24px', height: '24px', mr: 1 }} />
              <Typography>
                <Trans>Add to wallet</Trans>
              </Typography>
            </Button>
          </Box>
        )}
      </Box>
    </BaseSuccessView>
  );
};
