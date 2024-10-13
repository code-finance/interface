import { normalize, normalizeBN, valueToBigNumber } from '@aave/math-utils';
import { ContractMethod, OptimalRate, SwapSide } from '@paraswap/sdk';
import { RateOptions } from '@paraswap/sdk/dist/methods/swap/rates';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

  const exactInRate = useCallback(() => {
    if (isConnectNetWorkTon) {
      const swapOutAmount = valueToBigNumber(swapIn.amount)
        .multipliedBy(swapIn.priceInUSD)
        .div(swapOut.priceInUSD);
      const amountUSD = valueToBigNumber(swapOutAmount).multipliedBy(swapOut.priceInUSD);

      const swapInAmount = BigNumber.min(
        valueToBigNumber(amountUSD).div(swapIn.priceInUSD),
        valueToBigNumber(swapIn.amount)
      );

      const amount = normalizeBN(swapOutAmount, swapOut.decimals * -1);
      const srcAmount = normalizeBN(swapInAmount, swapIn.decimals * -1);

      const options: RateOptions = {
        partner: 'aave',
      };

      if (max) {
        options.includeContractMethods = [ContractMethod.buy];
      }

      return {
        blockNumber: 126563785,
        network: 10,
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
                    poolAddresses: ['0xd28f71e383e93c570d3edfe82ebbceb35ec6c412'],
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
        contractAddress: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
        tokenTransferProxy: '0x216b4b4ba9f3e719726886d34a177484278bfcae',
        contractMethod: 'buy',
        partnerFee: 0,
        srcUSD: amountUSD.toString(),
        destUSD: amountUSD.toString(),
        partner: 'aave',
        maxImpactReached: false,
        hmac: '7cae78a93aaa7c3a0659f2d0b1a9bba16caad166',
      };
    } else {
      return fetchExactInRate(swapInData, swapOutData, chainId, userAddress);
    }
  }, [chainId, swapInData, swapOutData, userAddress]);

  const exactOutRate = useCallback(() => {
    if (isConnectNetWorkTon) {
      const swapOutAmount = valueToBigNumber(swapOut.amount);
      const amountUSD = valueToBigNumber(swapOutAmount).multipliedBy(swapOut.priceInUSD);
      const swapInAmount = BigNumber.min(
        valueToBigNumber(amountUSD).div(swapIn.priceInUSD),
        valueToBigNumber(swapIn.amount)
      );

      const amount = normalizeBN(swapOutAmount, swapOut.decimals * -1);
      const srcAmount = normalizeBN(swapInAmount, swapIn.decimals * -1);

      const options: RateOptions = {
        partner: 'aave',
      };

      if (max) {
        options.includeContractMethods = [ContractMethod.buy];
      }

      return {
        blockNumber: 126563785,
        network: 10,
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
                    poolAddresses: ['0xd28f71e383e93c570d3edfe82ebbceb35ec6c412'],
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
        contractAddress: '0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57',
        tokenTransferProxy: '0x216b4b4ba9f3e719726886d34a177484278bfcae',
        contractMethod: 'buy',
        partnerFee: 0,
        srcUSD: amountUSD.toString(),
        destUSD: amountUSD.toString(),
        partner: 'aave',
        maxImpactReached: false,
        hmac: '7cae78a93aaa7c3a0659f2d0b1a9bba16caad166',
      };
    } else {
      return fetchExactOutRate(swapInData, swapOutData, chainId, userAddress, max);
    }
  }, [chainId, max, swapInData, swapOutData, userAddress]);

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
