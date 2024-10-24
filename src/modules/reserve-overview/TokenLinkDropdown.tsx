import { ExternalLinkIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, Menu, MenuItem, SvgIcon, Typography } from '@mui/material';
import { Address } from '@ton/core';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { CircleIcon } from 'src/components/CircleIcon';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import {
  ComputedReserveData,
  useAppDataContext,
} from 'src/hooks/app-data-provider/useAppDataProvider';
import { SCAN_TRANSACTION_TON } from 'src/hooks/app-data-provider/useAppDataProviderTon';
import { useAppTON } from 'src/hooks/useContract';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { useRootStore } from 'src/store/root';

import { RESERVE_DETAILS } from '../../utils/mixPanelEvents';

interface TokenLinkDropdownProps {
  poolReserve: ComputedReserveData;
  downToSM: boolean;
  hideAToken?: boolean;
}

export const TokenLinkDropdown = ({
  poolReserve,
  downToSM,
  hideAToken: hideATokenMain,
}: TokenLinkDropdownProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [jettonAddress, setJettonAddress] = useState<string>('');
  const { isTonNetwork, isConnectNetWorkTon } = useAppDataContext();
  const { walletAddressTonWallet } = useTonConnectContext();
  const AppTON = useAppTON();

  const { currentNetworkConfig, currentMarket } = useProtocolDataContext();
  const open = Boolean(anchorEl);
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    trackEvent(RESERVE_DETAILS.RESERVE_TOKENS_DROPDOWN, {
      assetName: poolReserve.name,
      asset: poolReserve.underlyingAsset,
      aToken: poolReserve.aTokenAddress,
      market: currentMarket,
      variableDebtToken: poolReserve.variableDebtTokenAddress,
    });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onGetJettonWallet = useCallback(async () => {
    if (!isConnectNetWorkTon && isTonNetwork) {
      setJettonAddress(poolReserve.underlyingAssetTon || '');
    } else {
      if (!AppTON || !walletAddressTonWallet)
        return setJettonAddress(poolReserve.underlyingAssetTon || '');
      const parsedTokenAddress = Address.parse(poolReserve.underlyingAssetTon || '');
      const parsedWalletAddress = Address.parse(walletAddressTonWallet);
      const address = await AppTON.getJettonWallet(parsedWalletAddress, parsedTokenAddress);
      setJettonAddress(address.toString());
    }
  }, [
    AppTON,
    isConnectNetWorkTon,
    isTonNetwork,
    poolReserve.underlyingAssetTon,
    walletAddressTonWallet,
  ]);

  useEffect(() => {
    onGetJettonWallet();
  }, [onGetJettonWallet, isConnectNetWorkTon, isTonNetwork]);

  if (!poolReserve) {
    return null;
  }

  const showVariableDebtToken = isConnectNetWorkTon
    ? false
    : poolReserve.borrowingEnabled || Number(poolReserve.totalVariableDebt) > 0;

  const showStableDebtToken = isConnectNetWorkTon
    ? false
    : poolReserve.stableBorrowRateEnabled || Number(poolReserve.totalStableDebt) > 0;

  const showDebtTokenHeader = showVariableDebtToken || showStableDebtToken;

  const hideAToken = isConnectNetWorkTon ? true : hideATokenMain;

  const explorerLink = isTonNetwork
    ? `${SCAN_TRANSACTION_TON}/${jettonAddress}`
    : currentNetworkConfig.explorerLinkBuilder({
        address: poolReserve?.stableDebtTokenAddress,
      });

  return (
    <>
      <Box onClick={handleClick}>
        <CircleIcon tooltipText={'View token contracts'} downToSM={downToSM}>
          <Box
            sx={(theme) => ({
              display: 'inline-flex',
              alignItems: 'center',
              color: theme.palette.text.primary,
              cursor: 'pointer',
            })}
          >
            <SvgIcon sx={{ fontSize: '14px' }}>
              <ExternalLinkIcon />
            </SvgIcon>
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
        <Box sx={{ px: 4, pt: 3, pb: 2 }}>
          <Typography variant="secondary12" color="text.secondary">
            <Trans>Underlying token</Trans>
          </Typography>
        </Box>

        <MenuItem
          onClick={() => {
            trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
              type: 'Underlying Token',
              assetName: poolReserve.name,
              asset: poolReserve.underlyingAsset,
              aToken: poolReserve.aTokenAddress,
              market: currentMarket,
              variableDebtToken: poolReserve.variableDebtTokenAddress,
            });
          }}
          component="a"
          href={explorerLink}
          target="_blank"
          divider
        >
          <TokenIcon symbol={poolReserve.iconSymbol} sx={{ fontSize: '20px' }} />
          <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
            {poolReserve.symbol}
          </Typography>
        </MenuItem>

        {!hideAToken && (
          <Box>
            <Box sx={{ px: 4, pt: 3, pb: 2 }}>
              <Typography variant="secondary12" color="text.secondary">
                <Trans>Aave aToken</Trans>
              </Typography>
            </Box>

            <MenuItem
              component="a"
              onClick={() => {
                trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                  type: 'aToken',
                  assetName: poolReserve.name,
                  asset: poolReserve.underlyingAsset,
                  aToken: poolReserve.aTokenAddress,
                  market: currentMarket,
                  variableDebtToken: poolReserve.variableDebtTokenAddress,
                });
              }}
              href={currentNetworkConfig.explorerLinkBuilder({
                address: poolReserve?.aTokenAddress,
              })}
              target="_blank"
              divider={showDebtTokenHeader}
            >
              <TokenIcon symbol={poolReserve.iconSymbol} aToken={true} sx={{ fontSize: '20px' }} />
              <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
                {'a' + poolReserve.symbol}
              </Typography>
            </MenuItem>
          </Box>
        )}

        {showDebtTokenHeader && (
          <Box sx={{ px: 4, pt: 3, pb: 2 }}>
            <Typography variant="secondary12" color="text.secondary">
              <Trans>Aave debt token</Trans>
            </Typography>
          </Box>
        )}
        {showVariableDebtToken && (
          <MenuItem
            component="a"
            href={currentNetworkConfig.explorerLinkBuilder({
              address: poolReserve?.variableDebtTokenAddress,
            })}
            target="_blank"
            onClick={() => {
              trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                type: 'Variable Debt',
                assetName: poolReserve.name,
                asset: poolReserve.underlyingAsset,
                aToken: poolReserve.aTokenAddress,
                market: currentMarket,
                variableDebtToken: poolReserve.variableDebtTokenAddress,
              });
            }}
          >
            <TokenIcon symbol="default" sx={{ fontSize: '20px' }} />
            <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
              {'Variable debt ' + poolReserve.symbol}
            </Typography>
          </MenuItem>
        )}
        {showStableDebtToken && (
          <MenuItem
            component="a"
            href={currentNetworkConfig.explorerLinkBuilder({
              address: poolReserve?.stableDebtTokenAddress,
            })}
            target="_blank"
            onClick={() => {
              trackEvent(RESERVE_DETAILS.RESERVE_TOKEN_ACTIONS, {
                type: 'Stable Debt',
                assetName: poolReserve.name,
                asset: poolReserve.underlyingAsset,
                aToken: poolReserve.aTokenAddress,
                market: currentMarket,
                variableDebtToken: poolReserve.variableDebtTokenAddress,
                stableDebtToken: poolReserve.stableDebtTokenAddress,
              });
            }}
          >
            <TokenIcon symbol="default" sx={{ fontSize: '20px' }} />
            <Typography variant="subheader1" sx={{ ml: 3 }} noWrap data-cy={`assetName`}>
              {'Stable debt ' + poolReserve.symbol}
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
