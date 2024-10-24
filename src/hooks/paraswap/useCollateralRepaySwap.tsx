import { normalize, normalizeBN, valueToBigNumber } from '@aave/math-utils';
import { OptimalRate, SwapSide } from '@paraswap/sdk';
import { Address } from '@ton/core';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { address_pools } from '../app-data-provider/useAppDataProviderTon';
import { useAppFactoryTON } from '../useContract';
import {
  convertParaswapErrorMessage,
  fetchExactInRate,
  fetchExactInTxParams,
  fetchExactOutRate,
  fetchExactOutTxParams,
  SwapData,
  SwapTransactionParams,
  SwapVariant,
  UseSwapProps,
} from './common';

type UseRepayWithCollateralProps = UseSwapProps & {
  swapVariant: SwapVariant;
  isConnectNetWorkTon: boolean;
  debt: string;
};

interface UseRepayWithCollateralResponse {
  outputAmount: string;
  outputAmountUSD: string;
  inputAmount: string;
  inputAmountUSD: string;
  loading: boolean;
  error: string;
  buildTxFn: () => Promise<SwapTransactionParams>;
}
interface DataSwapOut {
  data: {
    amountIn: string;
    amountOut: string;
    decimalsIn: number;
    decimalsOut: number;
    symbolIn: string;
    symbolOut: string;
  };
  status: string;
}
export const useCollateralRepaySwap = ({
  chainId,
  max,
  maxSlippage,
  skip,
  swapIn,
  swapOut,
  userAddress,
  swapVariant,
  isConnectNetWorkTon,
  debt,
}: UseRepayWithCollateralProps): UseRepayWithCollateralResponse => {
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [inputAmountUSD, setInputAmountUSD] = useState<string>('0');
  const [outputAmount, setOutputAmount] = useState<string>('0');
  const [outputAmountUSD, setOutputAmountUSD] = useState<string>('0');
  const [route, setRoute] = useState<OptimalRate>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const swapInData = useMemo(() => {
    const swapData: SwapData = {
      underlyingAsset: swapIn.underlyingAsset,
      decimals: swapIn.decimals,
      supplyAPY: swapIn.supplyAPY,
      amount: swapIn.amount,
      variableBorrowAPY: swapIn.variableBorrowAPY,
    };
    return swapData;
  }, [
    swapIn.amount,
    swapIn.decimals,
    swapIn.supplyAPY,
    swapIn.underlyingAsset,
    swapIn.variableBorrowAPY,
  ]);

  const swapOutData = useMemo(() => {
    const swapData: SwapData = {
      underlyingAsset: swapOut.underlyingAsset,
      decimals: swapOut.decimals,
      supplyAPY: swapOut.supplyAPY,
      amount: swapOut.amount,
      variableBorrowAPY: swapOut.variableBorrowAPY,
    };
    return swapData;
  }, [
    swapOut.amount,
    swapOut.decimals,
    swapOut.supplyAPY,
    swapOut.underlyingAsset,
    swapOut.variableBorrowAPY,
  ]);

  const AppFactoryTON = useAppFactoryTON();

  const getRateTON = useCallback(
    async ({
      tokenIn,
      tokenOut,
      amountRepay,
    }: {
      tokenIn: string | undefined;
      tokenOut: string | undefined;
      amountRepay: string;
    }) => {
      if (!AppFactoryTON || !tokenIn || !tokenOut) return null;
      try {
        const amountOut = BigInt(Number(amountRepay).toFixed(0));
        const underlyingAddressIn = Address.parse(tokenIn);
        const underlyingAddressOut = Address.parse(tokenOut);

        const data = await AppFactoryTON.estimateAmountInSwap(
          amountOut,
          underlyingAddressIn,
          underlyingAddressOut
        );

        return data.toString();
      } catch (apiError) {
        return '0';
      }
    },
    [AppFactoryTON]
  );

  const exactInRateTON = useMemo(
    () =>
      async ({ max }: { max: boolean }) => {
        const amountRepay = max ? valueToBigNumber(debt) : valueToBigNumber(swapOut.amount);

        const params = {
          tokenOut: swapOut.underlyingAssetTon,
          tokenIn: swapIn.underlyingAssetTon,
          amountRepay: normalizeBN(amountRepay.toString(), swapOut.decimals * -1).toString(),
        };

        const amountOut = await getRateTON(params);

        const amountRepayUSD = amountRepay.multipliedBy(swapOut.priceInUSD);
        const amount = normalizeBN(amountRepay, swapOut.decimals * -1);

        const formatSrcAmount = normalize(amountOut || 0, swapIn.decimals);
        const srcAmount = normalizeBN(formatSrcAmount, swapIn.decimals * -1);

        const srcAmountUSD = valueToBigNumber(formatSrcAmount).multipliedBy(swapIn.priceInUSD);

        return {
          blockNumber: 126563785,
          network: -1,
          srcToken: swapIn.underlyingAsset,
          srcDecimals: swapIn.decimals,
          srcAmount: srcAmount.toFixed(0),
          destToken: swapOut.underlyingAsset,
          destDecimals: swapOut.decimals,
          destAmount: amount.toFixed(0),
          bestRoute: [
            {
              percent: 100,
              swaps: [
                {
                  srcToken: swapIn.underlyingAsset,
                  srcDecimals: swapIn.decimals,
                  destToken: swapOut.underlyingAsset,
                  destDecimals: swapOut.decimals,
                  swapExchanges: [
                    {
                      exchange: 'UniswapV3',
                      srcAmount: srcAmount.toFixed(0),
                      destAmount: amount.toFixed(0),
                      percent: 100,
                      poolAddresses: [`${address_pools}`],
                      data: {
                        path: [
                          {
                            tokenIn: swapIn.underlyingAsset,
                            tokenOut: swapOut.underlyingAsset,
                            fee: '100',
                            currentFee: '100',
                          },
                        ],
                        gasUSD: '0.000486',
                      },
                    },
                  ],
                },
              ],
            },
          ],
          gasCostUSD: '0.000973',
          gasCost: '218300',
          side: SwapSide.BUY,
          contractAddress: '',
          tokenTransferProxy: '',
          contractMethod: 'buy',
          partnerFee: 0,
          srcUSD: srcAmountUSD.toString(),
          destUSD: amountRepayUSD.toString(),
          partner: 'aave-ton',
          maxImpactReached: false,
          hmac: '',
        };
      },
    [
      debt,
      getRateTON,
      swapIn.decimals,
      swapIn.priceInUSD,
      swapIn.underlyingAsset,
      swapIn.underlyingAssetTon,
      swapOut.amount,
      swapOut.decimals,
      swapOut.priceInUSD,
      swapOut.underlyingAsset,
      swapOut.underlyingAssetTon,
    ]
  );

  const exactInRate = useCallback(() => {
    if (isConnectNetWorkTon) {
      return exactInRateTON({ max: true });
    } else {
      return fetchExactInRate(swapInData, swapOutData, chainId, userAddress);
    }
  }, [chainId, exactInRateTON, isConnectNetWorkTon, swapInData, swapOutData, userAddress]);

  const exactOutRate = useCallback(() => {
    if (isConnectNetWorkTon) {
      return exactInRateTON({ max: false });
    } else {
      return fetchExactOutRate(swapInData, swapOutData, chainId, userAddress, max);
    }
  }, [chainId, exactInRateTON, isConnectNetWorkTon, max, swapInData, swapOutData, userAddress]);

  useEffect(() => {
    if (skip) return;

    const fetchRoute = async () => {
      if (
        !swapInData.underlyingAsset ||
        !swapOutData.underlyingAsset ||
        (swapVariant === 'exactIn' &&
          (!swapInData.amount || swapInData.amount === '0' || isNaN(+swapInData.amount))) ||
        (swapVariant === 'exactOut' &&
          (!swapOutData.amount || swapOutData.amount === '0' || isNaN(+swapOutData.amount)))
      ) {
        setInputAmount('0');
        setInputAmountUSD('0');
        setOutputAmount('0');
        setOutputAmountUSD('0');
        setRoute(undefined);
        return;
      }

      setLoading(true);

      try {
        let route: OptimalRate;
        if (swapVariant === 'exactIn') {
          route = await exactInRate();
        } else {
          route = await exactOutRate();
        }

        setError('');
        setRoute(route);
        setInputAmount(normalize(route.srcAmount, route.srcDecimals));
        setOutputAmount(normalize(route.destAmount, route.destDecimals));
        setInputAmountUSD(route.srcUSD);
        setOutputAmountUSD(route.destUSD);
      } catch (e) {
        console.error(e);
        const message = convertParaswapErrorMessage(e.message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    // Update the transaction on any dependency change
    const timeout = setTimeout(() => {
      fetchRoute();
    }, 400);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    skip,
    swapVariant,
    swapInData.underlyingAsset,
    swapInData.amount,
    swapOutData.underlyingAsset,
    swapOutData.amount,
    exactInRate,
    exactOutRate,
    maxSlippage,
  ]);

  return {
    outputAmount,
    outputAmountUSD,
    inputAmount,
    inputAmountUSD,
    loading,
    error,
    // Used for calling paraswap buildTx as very last step in transaction
    buildTxFn: async () => {
      if (!route) throw new Error('Route required to build transaction');
      if (swapVariant === 'exactIn') {
        return fetchExactInTxParams(route, swapIn, swapOut, chainId, userAddress, maxSlippage);
      } else {
        return fetchExactOutTxParams(route, swapIn, swapOut, chainId, userAddress, maxSlippage);
      }
    },
  };
};
