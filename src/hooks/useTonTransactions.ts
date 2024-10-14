import { InterestRate } from '@aave/contract-helpers';
import { valueToBigNumber } from '@aave/math-utils';
import { Address } from '@ton/core';
import { parseUnits } from 'ethers/lib/utils';
import _ from 'lodash';
import { useCallback } from 'react';

import { useAppTON } from './useContract';
import { useTonConnect } from './useTonConnect';
import { useTonGetTxByBOC } from './useTonGetTxByBOC';

export const ErrorCancelledTon = [
  'TON Tx Signature: User denied transaction signature.',
  '[ton_connect_sdk_error]tonconnectuierrortransactionwasnotsent',
  '[ton_connect_sdk_error]userrejectserror:userrejectstheactioninthewallet.canceledbytheuser',
  '[ton_connect_sdk_error]e:userrejectstheactioninthewallet.canceledbytheuser',
  '[ton_connect_sdk_error]ertransactionwasnotsent',
  '[ton_connect_sdk_error]userrejectserror:userrejectstheactioninthewallet.walletdeclinedtherequest',
  '[ton_connect_sdk_error]e:userrejectstheactioninthewallet.walletdeclinedtherequest',
  '[ton_connect_sdk_error]rrejectrequest',
  '[ton_connect_sdk_error]unknownerrorrejectrequest',
];

export interface RepayParamsSend {
  amount: string | number;
  isAToken: boolean;
  interestRateMode?: number;
  decimals?: number | undefined;
  isMaxSelected?: boolean | undefined;
  isJetton?: boolean;
  balance?: string;
  debtType?: InterestRate;
  underlyingAddressCollateral?: string;
}

export const useTonTransactions = (yourAddressWallet: string, underlyingAssetTon: string) => {
  const { onGetGetTxByBOC, getTransactionStatus } = useTonGetTxByBOC();
  const AppTON = useAppTON();
  const { sender, getLatestBoc } = useTonConnect();

  const approvedAmountTonAssume = {
    user: '0x6385fb98e0ae7bd76b55a044e1635244e46b07ef',
    token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    spender: '0xe9E52021f4e11DEAD8661812A0A6c8627abA2a54',
    amount: '-1',
  };

  const convertInterestRateMode = (interestRate: InterestRate | undefined): number => {
    return interestRate === InterestRate.Stable ? 0 : 1;
  };

  const handleTransaction = useCallback(
    async (transactionFunc: () => Promise<{ success: boolean; message: string }>) => {
      try {
        const res = await transactionFunc();

        if (res.success) {
          const boc = await getLatestBoc();
          const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);
          if (txHash) {
            const status = await getTransactionStatus(txHash);
            return { success: status, txHash, blocking: !status, message: txHash };
          } else {
            return { success: false, message: 'Transaction failed', blocking: false };
          }
        } else if (_.includes(ErrorCancelledTon, res.message)) {
          console.log(res.message);
          return { success: false, message: ErrorCancelledTon[0], blocking: false };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.log('Transaction failed:', error.replace(/\s+/g).toLowerCase());
        return { success: false, message: 'Transaction failed', blocking: false };
      }
    },
    [getLatestBoc, getTransactionStatus, onGetGetTxByBOC, yourAddressWallet]
  );
  const onSendSupplyTonNetwork = useCallback(
    async (amount: string) => {
      if (!AppTON || !amount || !sender) return { success: false, message: 'Invalid parameters' };
      try {
        await AppTON.sendSupply(sender, Address.parse(underlyingAssetTon), BigInt(amount));
        return { success: true, message: 'success' };
      } catch (error) {
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionSendSupplyTonNetwork = useCallback(
    (amount: string) => handleTransaction(() => onSendSupplyTonNetwork(amount)),
    [onSendSupplyTonNetwork, handleTransaction]
  );

  const onSendBorrowTonNetwork = useCallback(
    async (amount: string, interestRateMode: number) => {
      if (!AppTON || !amount || !sender) return { success: false, message: 'Invalid parameters' };
      try {
        await AppTON.sendBorrow(
          sender,
          Address.parse(underlyingAssetTon),
          BigInt(amount),
          interestRateMode
        );
        return { success: true, message: 'success' };
      } catch (error) {
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionSendBorrowTonNetwork = useCallback(
    (amount: string, interestRateMode: InterestRate) => {
      const rateMode = convertInterestRateMode(interestRateMode);
      return handleTransaction(() => onSendBorrowTonNetwork(amount, rateMode));
    },
    [onSendBorrowTonNetwork, handleTransaction]
  );

  const onToggleCollateralTonNetwork = useCallback(
    async (status: boolean) => {
      if (!AppTON || !sender) return { success: false, message: 'Invalid parameters' };
      try {
        await AppTON.sendSetUseReserveAsCollateral(
          sender,
          Address.parse(underlyingAssetTon),
          status
        );
        return { success: true, message: 'success' };
      } catch (error) {
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionToggleCollateralTonNetwork = useCallback(
    (status: boolean) => handleTransaction(() => onToggleCollateralTonNetwork(status)),
    [onToggleCollateralTonNetwork, handleTransaction]
  );

  const onSendWithdrawTonNetwork = useCallback(
    async (decimals: number | undefined, amount: string) => {
      if (!AppTON || !sender || !decimals) return { success: false, message: 'Invalid parameters' };
      try {
        const isMax = Number(amount) === -1;
        const parseAmount = isMax
          ? '1'
          : parseUnits(valueToBigNumber(amount).toFixed(decimals), decimals).toString();

        await AppTON.sendWithdraw(sender, Address.parse(underlyingAssetTon), {
          amount: BigInt(parseAmount),
          isMaxWithdraw: isMax,
        });
        return { success: true, message: 'success' };
      } catch (error) {
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionSendWithdrawTonNetwork = useCallback(
    (decimals: number | undefined, amount: string) =>
      handleTransaction(() => onSendWithdrawTonNetwork(decimals, amount)),
    [onSendWithdrawTonNetwork, handleTransaction]
  );

  const onSendRepayTonNetwork = useCallback(
    async (
      decimals: number | undefined,
      amount: string,
      interestRateMode: number,
      useAToken: boolean,
      isBuffer: boolean | undefined,
      _underlyingAddressCollateral?: string | undefined
    ) => {
      if (!AppTON || !sender || !decimals) return { success: false, message: 'Invalid parameters' };
      try {
        const isMaxRepay = Number(amount) === -1;
        const parseAmount = isMaxRepay
          ? '1'
          : parseUnits(
              valueToBigNumber(amount)
                .multipliedBy(isBuffer ? 1.001 : 1)
                .toFixed(decimals),
              decimals
            ).toString();

        const repayParams = {
          interestRateMode,
          isMaxRepay,
          useAToken,
        };

        const collateralAddress = _underlyingAddressCollateral
          ? Address.parse(_underlyingAddressCollateral)
          : undefined;

        await AppTON.sendRepay(
          sender,
          Address.parse(underlyingAssetTon),
          BigInt(parseAmount),
          repayParams,
          collateralAddress
        );
        return { success: true, message: 'success' };
      } catch (error) {
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionSendRepayTonNetwork = useCallback(
    async ({
      amount,
      decimals,
      isMaxSelected,
      isAToken,
      balance,
      debtType,
      underlyingAddressCollateral,
    }: RepayParamsSend) => {
      if (!balance) return { success: false, message: 'Invalid parameters', blocking: false };

      const isBuffer =
        isMaxSelected &&
        valueToBigNumber(amount).multipliedBy(1.001).isLessThan(valueToBigNumber(balance));

      const interestRateMode = convertInterestRateMode(debtType);

      return handleTransaction(() =>
        onSendRepayTonNetwork(
          decimals,
          amount.toString(),
          interestRateMode,
          isAToken,
          isBuffer,
          underlyingAddressCollateral
        )
      );
    },
    [handleTransaction, onSendRepayTonNetwork]
  );

  return {
    approvedAmountTonAssume,
    actionSendSupplyTonNetwork,
    actionSendBorrowTonNetwork,
    actionToggleCollateralTonNetwork,
    actionSendWithdrawTonNetwork,
    actionSendRepayTonNetwork,
  };
};
