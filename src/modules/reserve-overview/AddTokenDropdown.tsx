import { Trans } from '@lingui/macro';
import { Box, Menu, MenuItem, Typography } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { CircleIcon } from 'src/components/CircleIcon';
import { Base64Token, TokenIcon } from 'src/components/primitives/TokenIcon';
import { ComputedReserveData } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ERC20TokenType } from 'src/libs/web3-data-provider/Web3Provider';
import { useRootStore } from 'src/store/root';
import { RESERVE_DETAILS } from 'src/utils/mixPanelEvents';
import { WalletIcon3 } from '../../components/icons/WalletIcon3';

interface AddTokenDropdownProps {
  poolReserve: ComputedReserveData;
  downToSM: boolean;
  switchNetwork: (chainId: number) => Promise<void>;
  addERC20Token: (args: ERC20TokenType) => Promise<boolean>;
  currentChainId: number;
  connectedChainId: number;
  hideAToken?: boolean;
}

export const AddTokenDropdown = ({
  poolReserve,
  downToSM,
  switchNetwork,
  addERC20Token,
  currentChainId,
  connectedChainId,
  hideAToken,
}: AddTokenDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changingNetwork, setChangingNetwork] = useState(false);
  const [underlyingBase64, setUnderlyingBase64] = useState('');
  const [aTokenBase64, setATokenBase64] = useState('');
  const open = Boolean(anchorEl);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // The switchNetwork function has no return type, so to detect if a user successfully switched networks before adding token to wallet, check the selected vs connected chain id
  useEffect(() => {
    if (changingNetwork && currentChainId === connectedChainId) {
      addERC20Token({
        address: poolReserve.underlyingAsset,
        decimals: poolReserve.decimals,
        symbol: poolReserve.symbol,
        image: !/_/.test(poolReserve.iconSymbol) ? underlyingBase64 : undefined,
      });
      setChangingNetwork(false);
    }
  }, [
    currentChainId,
    connectedChainId,
    changingNetwork,
    addERC20Token,
    poolReserve?.underlyingAsset,
    poolReserve?.decimals,
    poolReserve?.symbol,
    poolReserve?.iconSymbol,
    underlyingBase64,
  ]);

  if (!poolReserve) {
    return null;
  }

  return (
    <>
      {/* Load base64 token symbol for adding underlying and aTokens to wallet */}
      {poolReserve?.symbol && !/_/.test(poolReserve.symbol) && (
        <>
          <Base64Token
            symbol={poolReserve.iconSymbol}
            onImageGenerated={setUnderlyingBase64}
            aToken={false}
          />
          {!hideAToken && (
            <Base64Token
              symbol={poolReserve.iconSymbol}
              onImageGenerated={setATokenBase64}
              aToken={true}
            />
          )}
        </>
      )}
      <Box onClick={handleClick}>
        <CircleIcon tooltipText="Add token to wallet" downToSM={downToSM}>
          <Box
            onClick={() => {
              trackEvent(RESERVE_DETAILS.ADD_TOKEN_TO_WALLET_DROPDOWN, {
                asset: poolReserve.underlyingAsset,
                assetName: poolReserve.name,
              });
            }}
            sx={(theme) => ({
              display: 'inline-flex',
              alignItems: 'center',
              color: theme.palette.text.primary,
              cursor: 'pointer',
            })}
          >
            <WalletIcon3 sx={{ width: '14px', height: '14px' }} />
          </Box>
        </CircleIcon>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        keepMounted={true}
        data-cy="addToWaletSelector"
      >
        <Box sx={{ px: 3, py: 4, width: '260px' }}>
          <Box sx={{ pt: 2 }}>
            <Typography
              variant="detail2"
              color="text.mainTitle"
              sx={{ px: 1.5, my: 1 }}
              component="div"
            >
              <Trans>Underlying token</Trans>
            </Typography>
            <MenuItem
              key="underlying"
              value="underlying"
              sx={{ py: 4, px: 1.5 }}
              divider
              onClick={() => {
                if (currentChainId !== connectedChainId) {
                  switchNetwork(currentChainId).then(() => {
                    setChangingNetwork(true);
                  });
                } else {
                  trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                    type: 'Underlying token',
                    asset: poolReserve.underlyingAsset,
                    assetName: poolReserve.name,
                  });

                  addERC20Token({
                    address: poolReserve.underlyingAsset,
                    decimals: poolReserve.decimals,
                    symbol: poolReserve.symbol,
                    image: !/_/.test(poolReserve.symbol) ? underlyingBase64 : undefined,
                  });
                }
                handleClose();
              }}
            >
              <TokenIcon symbol={poolReserve.iconSymbol} sx={{ fontSize: '24px' }} />
              <Typography variant="body6" sx={{ ml: 2 }} noWrap data-cy={`assetName`}>
                {poolReserve.symbol}
              </Typography>
            </MenuItem>
          </Box>

          {!hideAToken && (
            <Box sx={{ pt: 2 }}>
              <Typography
                variant="detail2"
                color="text.mainTitle"
                sx={{ px: 1.5, my: 1 }}
                component="div"
              >
                <Trans>Code cToken</Trans>
              </Typography>
              <MenuItem
                key="atoken"
                value="atoken"
                sx={{ py: 4, px: 1.5 }}
                onClick={() => {
                  if (currentChainId !== connectedChainId) {
                    switchNetwork(currentChainId).then(() => {
                      setChangingNetwork(true);
                    });
                  } else {
                    trackEvent(RESERVE_DETAILS.ADD_TO_WALLET, {
                      asset: poolReserve.underlyingAsset,
                      assetName: poolReserve.name,
                    });

                    addERC20Token({
                      address: poolReserve.aTokenAddress,
                      decimals: poolReserve.decimals,
                      symbol: '',
                      image: !/_/.test(poolReserve.symbol) ? aTokenBase64 : undefined,
                    });
                  }
                  handleClose();
                }}
              >
                <TokenIcon
                  symbol={poolReserve.iconSymbol}
                  sx={{ fontSize: '24px' }}
                  aToken={true}
                />
                <Typography variant="body6" sx={{ ml: 2 }} noWrap data-cy={`assetName`}>
                  {`c${poolReserve.symbol}`}
                </Typography>
              </MenuItem>
            </Box>
          )}
        </Box>
      </Menu>
    </>
  );
};
