import { API_ETH_MOCK_ADDRESS } from '@aave/contract-helpers';
import { normalize, valueToBigNumber } from '@aave/math-utils';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import { Box, CircularProgress, Stack, useTheme } from '@mui/material';
import { BigNumber } from 'ethers/lib/ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import _ from 'lodash';
import React, { ReactNode, useMemo, useState } from 'react';
import { GasTooltip } from 'src/components/infoTooltips/GasTooltip';
import { Warning } from 'src/components/primitives/Warning';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useWalletBalances } from 'src/hooks/app-data-provider/useWalletBalances';
import { usePoolReservesHumanized } from 'src/hooks/pool/usePoolReserves';
import { useGasStation } from 'src/hooks/useGasStation';
import { useIsContractAddress } from 'src/hooks/useIsContractAddress';
import { ModalType, useModalContext } from 'src/hooks/useModal';
import { useRootStore } from 'src/store/root';
import { getNetworkConfig, marketsData } from 'src/utils/marketsAndNetworksConfig';
import invariant from 'tiny-invariant';

import {
  address_pools,
  GAS_FEE_BORROW_TON_NETWORK,
  GAS_FEE_COLLATERAL_TON_NETWORK,
  GAS_FEE_REPAY_JETTONS_TON_NETWORK,
  GAS_FEE_REPAY_TON_TON_NETWORK,
  GAS_FEE_SUPPLY_JETTONS_TON_NETWORK,
  GAS_FEE_SUPPLY_TON_TON_NETWORK,
  GAS_FEE_TON,
  GAS_FEE_WITHDRAW_TON_NETWORK,
} from 'src/helpers/ton-export';
import { useSocketGetRateUSD } from 'src/hooks/app-data-provider/useSocketGetRateUSD';
import { GasPriceData, useGasPrice } from '../../../hooks/useGetGasPrices';
import { FormattedNumber } from '../../primitives/FormattedNumber';
import { GasOption } from './GasStationProvider';

export interface GasStationProps {
  gasLimit: BigNumber;
  skipLoad?: boolean;
  disabled?: boolean;
  rightComponent?: ReactNode;
  chainId?: number;
}

export const getGasCosts = (
  gasLimit: BigNumber,
  gasOption: GasOption,
  customGas: string,
  gasData: GasPriceData,
  baseCurrencyUsd: string
) => {
  const gasPrice =
    gasOption === GasOption.Custom
      ? parseUnits(customGas, 'gwei').toString()
      : gasData[gasOption].legacyGasPrice;
  return Number(formatUnits(gasLimit.mul(gasPrice), 18)) * parseFloat(baseCurrencyUsd);
};

export const GasStation: React.FC<GasStationProps> = ({
  gasLimit,
  skipLoad,
  disabled,
  rightComponent,
  chainId,
}) => {
  const [gasFeeMarketTON, setGasFeeMarketTON] = useState<number | string>('0');
  const [isGasLimitTokenTON, setIsGasLimitTokenTON] = useState<boolean>(false);
  const { state } = useGasStation();
  const { balanceTokenTONMarket, isConnectNetWorkTon, reserves } = useAppDataContext();
  const [currentChainId, account] = useRootStore((store) => [store.currentChainId, store.account]);
  const selectedChainId = chainId ?? currentChainId;
  // TODO: find a better way to query base token price instead of using a random market.
  const marketOnNetwork = Object.values(marketsData).find(
    (elem) => elem.chainId === selectedChainId
  );
  invariant(marketOnNetwork, 'No market for this network');
  const { data: poolReserves } = usePoolReservesHumanized(marketOnNetwork);
  const { data: gasPrice } = useGasPrice(selectedChainId);
  const { walletBalances } = useWalletBalances(marketOnNetwork);
  const { data: isContractAddress } = useIsContractAddress(account);
  const nativeBalanceUSD = walletBalances[API_ETH_MOCK_ADDRESS.toLowerCase()]?.amountUSD;
  const { name, baseAssetSymbol } = getNetworkConfig(selectedChainId);
  const theme = useTheme();

  const { loadingTxns, type, args } = useModalContext();

  const { ExchangeRateListUSD } = useSocketGetRateUSD();

  const getFeeTon = (type: ModalType | undefined, isJetton?: boolean): number => {
    let gas = 0;
    switch (type) {
      case ModalType.Supply:
        if (isJetton) {
          gas = GAS_FEE_SUPPLY_JETTONS_TON_NETWORK;
        } else {
          gas = GAS_FEE_SUPPLY_TON_TON_NETWORK;
        }
        break;
      case ModalType.Borrow:
        gas = GAS_FEE_BORROW_TON_NETWORK;
        break;
      case ModalType.Withdraw:
        gas = GAS_FEE_WITHDRAW_TON_NETWORK;
        break;
      case ModalType.Repay:
        if (isJetton) {
          gas = GAS_FEE_REPAY_JETTONS_TON_NETWORK;
        } else {
          gas = GAS_FEE_REPAY_TON_TON_NETWORK;
        }
        break;
      case ModalType.CollateralChange:
        gas = GAS_FEE_COLLATERAL_TON_NETWORK;
        break;
      default:
        gas = 0;
        break;
    }
    return gas;
  };

  useMemo(() => {
    const result = _.find(ExchangeRateListUSD, { address: address_pools });
    const reserve = _.find(reserves, { underlyingAsset: args.underlyingAsset });
    const isJetton = reserve?.underlyingAssetTon !== address_pools;
    const fee = getFeeTon(type, isJetton);
    const gasFee = valueToBigNumber(result?.usd || 0)
      .multipliedBy(fee || 0)
      .toString();
    const gasFeeFormat = normalize(gasFee, result?.decimal || 9);
    setGasFeeMarketTON(gasFeeFormat);

    if (!isJetton && valueToBigNumber(balanceTokenTONMarket).isLessThan(gasFeeFormat)) {
      setIsGasLimitTokenTON(true);
    } else {
      setIsGasLimitTokenTON(false);
    }
  }, [ExchangeRateListUSD, args.underlyingAsset, balanceTokenTONMarket, reserves, type]);

  const totalGasCostsUsd =
    gasPrice && poolReserves?.baseCurrencyData
      ? getGasCosts(
          gasLimit,
          state.gasOption,
          state.customGas,
          gasPrice,
          normalize(
            poolReserves?.baseCurrencyData.networkBaseTokenPriceInUsd,
            poolReserves?.baseCurrencyData.networkBaseTokenPriceDecimals
          )
        )
      : undefined;

  const showNotEnoughFeesTON =
    (!disabled && !isContractAddress && Number(balanceTokenTONMarket) < Number(gasFeeMarketTON)) ||
    isGasLimitTokenTON;

  const showNotEnoughFeesMain =
    !disabled && !isContractAddress && Number(nativeBalanceUSD) < Number(totalGasCostsUsd);

  const showNotEnoughFees = isConnectNetWorkTon ? showNotEnoughFeesTON : showNotEnoughFeesMain;

  return (
    <Stack sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalGasStationIcon
            sx={{
              width: 24,
              height: 24,
              p: '1px 2px 3px 2px',
              mr: '4px',
              color: theme.palette.text.subTitle,
            }}
          />

          {loadingTxns && !skipLoad ? (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          ) : (totalGasCostsUsd && !disabled) || isConnectNetWorkTon ? (
            <>
              <FormattedNumber
                value={
                  isConnectNetWorkTon ? gasFeeMarketTON : totalGasCostsUsd ? totalGasCostsUsd : '-'
                }
                symbol="USD"
                color="text.subTitle"
                variant="detail3"
                symbolsColor="text.subTitle"
                symbolsVariant="detail3"
              />
              <GasTooltip iconSize={18} iconColor="text.subTitle" />
            </>
          ) : (
            '-'
          )}
        </Box>
        {rightComponent}
      </Box>
      {showNotEnoughFees && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning severity="warning" sx={{ mb: 0, mx: 'auto' }}>
            You do not have enough {baseAssetSymbol} in your account to pay for transaction fees on{' '}
            {name} network. Please deposit {baseAssetSymbol} from another account.
          </Warning>
        </Box>
      )}
    </Stack>
  );
};
