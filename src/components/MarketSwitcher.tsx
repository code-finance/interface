import { ChevronDownIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Box,
  BoxProps,
  ListItemText,
  MenuItem,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import { useRootStore } from 'src/store/root';
import { BaseNetworkConfig } from 'src/ui-config/networksConfig';
import { DASHBOARD } from 'src/utils/mixPanelEvents';

import { useProtocolDataContext } from '../hooks/useProtocolDataContext';
import {
  availableMarkets,
  CustomMarket,
  ENABLE_TESTNET,
  MarketDataType,
  marketsData,
  networkConfigs,
  STAGING_ENV,
} from '../utils/marketsAndNetworksConfig';

export const MULTIPLE_MARKET_OPTIONS = [
  CustomMarket.proto_mainnet_v3,
  'fork_proto_lido_v3',
  'fork_proto_mainnet_v3',
];

export const getMarketInfoById = (marketId: CustomMarket) => {
  const market: MarketDataType = marketsData[marketId as CustomMarket];
  const network: BaseNetworkConfig = networkConfigs[market.chainId];

  return { market, network };
};

export const getMarketHelpData = (marketName: string) => {
  const testChains = [
    'Görli',
    'Ropsten',
    'Mumbai',
    'Sepolia',
    'Fuji',
    'Testnet',
    'Kovan',
    'Rinkeby',
  ];

  const arrayName = marketName.split(' ');

  const testChainName = arrayName.filter((el) => testChains.indexOf(el) > -1);

  const marketTitle =
    // Note: We keep Eth for Lido market and fetch Lido market data
    marketName === 'Ethereum Lido Market'
      ? 'Ethereum'
      : arrayName.filter((el) => !testChainName.includes(el)).join(' ');

  return {
    name: marketTitle,
    testChainName: testChainName[0],
  };
};

export type Market = {
  marketTitle: string;
  networkName: string;
  networkLogo: string;
  selected?: boolean;
};

type MarketLogoProps = {
  size: number;
  logo: string;
  testChainName?: string;
  sx?: BoxProps;
};

export const MarketLogo = ({ size, logo, testChainName, sx }: MarketLogoProps) => {
  const theme = useTheme();
  const xsm = useMediaQuery(theme.breakpoints.up('xsm'));
  return (
    <Box sx={{ mr: 2, width: size, height: size, position: 'relative', ...sx }}>
      <img src={logo} alt="" width="100%" height="100%" />

      {testChainName && (
        <Tooltip title={testChainName} arrow>
          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.text.buttonText,
              width: xsm ? '16px' : '12px',
              height: xsm ? '16px' : '12px',
              borderRadius: '50%',
              fontSize: xsm ? '12px' : '10px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: '-2px',
              bottom: '-2px',
              color: theme.palette.text.primary,
            })}
          >
            {testChainName.split('')[0]}
          </Box>
        </Tooltip>
      )}
    </Box>
  );
};

enum SelectedMarketVersion {
  V2,
  V3,
}

export const MarketSwitcher = ({ viewOnly }: { viewOnly?: boolean }) => {
  const { currentMarket, setCurrentMarket } = useProtocolDataContext();
  const [selectedMarketVersion, setSelectedMarketVersion] = useState<SelectedMarketVersion>(
    SelectedMarketVersion.V3
  );
  const theme = useTheme();
  const upToLG = useMediaQuery(theme.breakpoints.up('xsm'));
  const trackEvent = useRootStore((store) => store.trackEvent);

  const handleMarketSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    trackEvent(DASHBOARD.CHANGE_MARKET, { market: e.target.value });
    setCurrentMarket(e.target.value as unknown as CustomMarket);
  };

  return (
    <TextField
      select
      aria-label="select market"
      data-cy="marketSelector"
      disabled={viewOnly}
      value={currentMarket}
      onChange={handleMarketSelect}
      sx={{
        mr: 2,
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
        '& .MuiSelect-select.MuiSelect-outlined': {
          overflow: 'visible !important',
          '&.Mui-disabled': {
            '-webkit-text-fill-color': 'unset',
          },
        },
      }}
      SelectProps={{
        native: false,
        className: 'MarketSwitcher__select',
        IconComponent: (props) =>
          viewOnly ? (
            <></>
          ) : (
            <SvgIcon
              fontSize={upToLG ? 'medium' : 'small'}
              {...props}
              sx={(theme) => ({
                color: `${theme.palette.text.primary} !important`,
              })}
            >
              <ChevronDownIcon />
            </SvgIcon>
          ),
        renderValue: (marketId) => {
          const { market, network } = getMarketInfoById(marketId as CustomMarket);

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MarketLogo
                size={upToLG ? 44 : 28}
                logo={network.networkLogoPath}
                testChainName={getMarketHelpData(market.marketTitle).testChainName}
              />
              <Box
                sx={{
                  ml: { xs: 1, md: 2 },
                  mr: 1,
                  display: 'inline-flex',
                  alignItems: 'flex-start',
                }}
              >
                <Typography
                  variant={upToLG ? 'h1' : 'h2'}
                  component="h1"
                  sx={(theme) => ({
                    color: theme.palette.text.primary,
                    mr: 1,
                  })}
                >
                  {getMarketHelpData(market.marketTitle).name + ' Market'}{' '}
                  {market.isFork ? 'Fork' : ''}
                  {/* {upToLG && ' Market'} */}
                  {upToLG && ''}
                </Typography>
              </Box>
            </Box>
          );
        },
        sx: {
          height: '48px',
          '.MuiSelect-select': {
            height: '100% !important',
          },
          '&.MarketSwitcher__select .MuiSelect-outlined': {
            pl: 0,
            py: 0,
            backgroundColor: 'transparent !important',
          },
        },
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
          PaperProps: {
            sx: (theme) => ({
              py: 1,
              maxHeight: 410,
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '::-webkit-scrollbar': {
                display: 'none',
              },
              backgroundColor: theme.palette.background.secondary,
              border: `1px solid ${theme.palette.border.contents}`,
              boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)',
            }),
            style: {
              minWidth: 220,
            },
            variant: 'outlined',
            elevation: 0,
          },
        },
      }}
    >
      <Box>
        <Typography variant="detail4" color="text.secondary" sx={{ px: 4, mb: 1 }} component="div">
          <Trans>{ENABLE_TESTNET || STAGING_ENV ? 'Select Testnet Market' : 'Select Market'}</Trans>
        </Typography>
      </Box>

      {/*{isV3MarketsAvailable && (*/}
      {/*  <Box sx={{ mx: '18px', display: 'flex', justifyContent: 'center' }}>*/}
      {/*    <StyledToggleButtonGroup*/}
      {/*      value={selectedMarketVersion}*/}
      {/*      exclusive*/}
      {/*      onChange={(_, value) => {*/}
      {/*        if (value !== null) {*/}
      {/*          setSelectedMarketVersion(value);*/}
      {/*        }*/}
      {/*      }}*/}
      {/*      sx={{*/}
      {/*        width: '100%',*/}
      {/*        height: '36px',*/}
      {/*        background: theme.palette.primary.main,*/}
      {/*        border: `1px solid ${*/}
      {/*          theme.palette.mode === 'dark' ? 'rgba(235, 235, 237, 0.12)' : '#1B2030'*/}
      {/*        }`,*/}
      {/*        borderRadius: '6px',*/}
      {/*        marginTop: '16px',*/}
      {/*        marginBottom: '12px',*/}
      {/*        padding: '2px',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <StyledToggleButton*/}
      {/*        value={SelectedMarketVersion.V3}*/}
      {/*        data-cy={`markets_switch_button_v3`}*/}
      {/*        sx={{*/}
      {/*          backgroundColor: theme.palette.mode === 'dark' ? '#EAEBEF' : '#383D51',*/}
      {/*          '&.Mui-selected, &.Mui-selected:hover': {*/}
      {/*            backgroundColor: theme.palette.mode === 'dark' ? '#292E41' : '#FFFFFF',*/}
      {/*            boxShadow: '0px 1px 0px rgba(0, 0, 0, 0.05)',*/}
      {/*          },*/}
      {/*          borderRadius: '4px',*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <Typography*/}
      {/*          variant="buttonM"*/}
      {/*          sx={*/}
      {/*            selectedMarketVersion === SelectedMarketVersion.V3*/}
      {/*              ? {*/}
      {/*                  backgroundImage: (theme) => theme.palette.gradients.aaveGradient,*/}
      {/*                  backgroundClip: 'text',*/}
      {/*                  color: 'transparent',*/}
      {/*                }*/}
      {/*              : {*/}
      {/*                  color: theme.palette.mode === 'dark' ? '#0F121D' : '#FFFFFF',*/}
      {/*                }*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <Trans>Version 3</Trans>*/}
      {/*        </Typography>*/}
      {/*      </StyledToggleButton>*/}
      {/*      <StyledToggleButton*/}
      {/*        value={SelectedMarketVersion.V2}*/}
      {/*        data-cy={`markets_switch_button_v2`}*/}
      {/*        sx={{*/}
      {/*          backgroundColor: theme.palette.mode === 'dark' ? '#EAEBEF' : '#383D51',*/}
      {/*          '&.Mui-selected, &.Mui-selected:hover': {*/}
      {/*            backgroundColor: theme.palette.mode === 'dark' ? '#292E41' : '#FFFFFF',*/}
      {/*            boxShadow: '0px 1px 0px rgba(0, 0, 0, 0.05)',*/}
      {/*          },*/}
      {/*          borderRadius: '4px',*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <Typography*/}
      {/*          variant="buttonM"*/}
      {/*          sx={*/}
      {/*            selectedMarketVersion === SelectedMarketVersion.V2*/}
      {/*              ? {*/}
      {/*                  backgroundImage: (theme) => theme.palette.gradients.aaveGradient,*/}
      {/*                  backgroundClip: 'text',*/}
      {/*                  color: 'transparent',*/}
      {/*                }*/}
      {/*              : {*/}
      {/*                  color: theme.palette.mode === 'dark' ? '#0F121D' : '#FFFFFF',*/}
      {/*                }*/}
      {/*          }*/}
      {/*        >*/}
      {/*          <Trans>Version 2</Trans>*/}
      {/*        </Typography>*/}
      {/*      </StyledToggleButton>*/}
      {/*    </StyledToggleButtonGroup>*/}
      {/*  </Box>*/}
      {/*)}*/}
      {availableMarkets.map((marketId: CustomMarket) => {
        const { market, network } = getMarketInfoById(marketId);
        const marketNaming = getMarketHelpData(market.marketTitle);
        return (
          <MenuItem
            key={marketId}
            data-cy={`marketSelector_${marketId}`}
            value={marketId}
            sx={{
              py: '13.5px',
              px: 3,
              '.MuiListItemIcon-root': { minWidth: 'unset' },
              display:
                (market.v3 && selectedMarketVersion === SelectedMarketVersion.V2) ||
                (!market.v3 && selectedMarketVersion === SelectedMarketVersion.V3)
                  ? 'none'
                  : 'flex',
            }}
          >
            <MarketLogo
              size={24}
              logo={network.networkLogoPath}
              testChainName={marketNaming.testChainName}
            />
            {marketNaming.name + ' Market'} {market.isFork ? 'Fork' : ''}
            <ListItemText sx={{ textAlign: 'right' }}>
              <Typography color="text.muted" variant="description">
                {marketNaming.testChainName}
              </Typography>
            </ListItemText>
          </MenuItem>
        );
      })}
    </TextField>
  );
};
