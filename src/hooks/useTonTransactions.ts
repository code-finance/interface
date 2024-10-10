import { InterestRate } from '@aave/contract-helpers';
import { valueToBigNumber } from '@aave/math-utils';
import { Address, beginCell, Cell, OpenedContract, toNano } from '@ton/core';
import { parseUnits } from 'ethers/lib/utils';
import _ from 'lodash';
import { useCallback } from 'react';
import { Op } from 'src/contracts/JettonConstants';
import { JettonMinter } from 'src/contracts/JettonMinter';
import { JettonWallet } from 'src/contracts/JettonWallet';
import { Pool, RepayParams } from 'src/contracts/Pool';
import { getMultiSig } from 'src/contracts/utils';

// import { KeyPair, sign } from 'ton-crypto';
import { address_pools, GAS_FEE_TON } from './app-data-provider/useAppDataProviderTon';
import { FormattedReservesAndIncentives } from './pool/usePoolFormattedReserves';
import { useAppTON, useContract } from './useContract';
import { useTonClient } from './useTonClient';
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
}

export const useTonTransactions = (yourAddressWallet: string, underlyingAssetTon: string) => {
  const { onGetGetTxByBOC, getTransactionStatus } = useTonGetTxByBOC();
  const client = useTonClient();
  const AppTON = useAppTON();
  const { sender, getLatestBoc } = useTonConnect();

  const providerJettonMinter = useContract<JettonMinter>(underlyingAssetTon, JettonMinter);
  const providerPoolAssetTon = useContract<Pool>(underlyingAssetTon, Pool);
  const providerPool = useContract<Pool>(address_pools, Pool);

  const approvedAmountTonAssume = {
    user: '0x6385fb98e0ae7bd76b55a044e1635244e46b07ef',
    token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    spender: '0xe9E52021f4e11DEAD8661812A0A6c8627abA2a54',
    amount: '-1',
  };

  const onSendSupplyTonNetwork = useCallback(
    async (amount: string) => {
      if (!AppTON || !amount || !sender) return;
      try {
        await AppTON.sendSupply(
          sender, //via: Sender,
          Address.parse(underlyingAssetTon),
          BigInt(amount) // User input amount
        );

        return { success: true, message: 'success' };
      } catch (error) {
        console.error('Transaction failed:', error);
        console.log(error.message.replace(/\s+/g, '').toLowerCase());
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [AppTON, sender, underlyingAssetTon]
  );

  const actionSendSupplyTon = useCallback(
    async (amount: string) => {
      try {
        const res = await onSendSupplyTonNetwork(amount);

        const boc = await getLatestBoc();
        const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);

        if (txHash && !!res?.success) {
          const status = await getTransactionStatus(txHash);
          return {
            success: status,
            txHash: txHash,
            blocking: !status,
            message: txHash,
          };
        } else if (_.includes(ErrorCancelledTon, res?.message)) {
          return {
            success: false,
            message: ErrorCancelledTon[0],
            blocking: false,
          };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.log('error supply', error);
        return { success: false, message: `Transaction failed`, blocking: false };
      }
    },
    [getLatestBoc, getTransactionStatus, onGetGetTxByBOC, onSendSupplyTonNetwork, yourAddressWallet]
  );

  const onSendBorrowJettonToken = useCallback(
    async (
      amount: string,
      poolReserve: FormattedReservesAndIncentives,
      interestRateMode: number
    ) => {
      if (!poolReserve || !providerPool || !poolReserve.poolJettonWalletAddress) return;
      try {
        const decimal = poolReserve.decimals; // poolReserve.decimals
        const parseAmount = parseUnits(
          valueToBigNumber(amount).toFixed(decimal),
          decimal
        ).toString();

        const dataMultiSig = await getMultiSig({
          isMock: false,
        });

        const params = {
          queryId: Date.now(),
          poolJettonWalletAddress: Address.parse(poolReserve.poolJettonWalletAddress),
          amount: BigInt(parseAmount),
          interestRateMode: interestRateMode,
          priceData: dataMultiSig,
        };

        await providerPool.sendBorrow(
          sender, //via: Sender
          params //via: Sender,
        );

        return { success: true, message: 'success' };
      } catch (error) {
        console.error('Transaction failed:', error);
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [providerPool, sender]
  );

  const onSendBorrowTon = useCallback(
    async (
      amount: string,
      poolReserve: FormattedReservesAndIncentives,
      interestRateMode: InterestRate
    ) => {
      const rateMode = interestRateMode === InterestRate.Stable ? 0 : 1; // 0 - INTEREST_MODE_STABLE  // 1 - INTEREST_MODE_VARIABLE

      if (!poolReserve || !providerPool || !poolReserve.poolJettonWalletAddress)
        return { success: false, message: 'error', blocking: false };

      try {
        const res = await onSendBorrowJettonToken(amount, poolReserve, rateMode);

        const boc = await getLatestBoc();
        const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);

        if (txHash && !!res?.success) {
          const status = await getTransactionStatus(txHash);
          return { success: status, txHash: txHash, blocking: !status, message: txHash };
        } else if (_.includes(ErrorCancelledTon, res?.message)) {
          return {
            success: false,
            message: ErrorCancelledTon[0],
            blocking: false,
          };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        return { success: false, message: 'Transaction failed', blocking: false };
      }
    },
    [
      getLatestBoc,
      getTransactionStatus,
      onGetGetTxByBOC,
      onSendBorrowJettonToken,
      providerPool,
      yourAddressWallet,
    ]
  );

  const onToggleCollateralTon = useCallback(
    async (poolJWAddress: string, status: boolean) => {
      if (!client || !providerPool || !poolJWAddress) return;
      try {
        const dataMultiSig = await getMultiSig({
          isMock: false,
        });

        const params = {
          poolJWAddress: Address.parse(poolJWAddress),
          useAsCollateral: status,
          priceData: dataMultiSig,
        };

        await providerPool.sendSetUseReserveAsCollateral(sender, params);

        const boc = await getLatestBoc();
        const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);

        if (txHash) {
          const status = await getTransactionStatus(txHash);
          return { success: status, txHash: txHash, blocking: !status, message: txHash };
        } else {
          return { success: false, error: 'No txHash received', blocking: false };
        }
      } catch (error) {
        console.error('Transaction failed:', error);
        const errorToCheck = error.message.replace(/\s+/g, '').toLowerCase();
        if (_.includes(ErrorCancelledTon, errorToCheck)) {
          return {
            success: false,
            message: ErrorCancelledTon[0],
            blocking: false,
          };
        } else {
          return { success: false, message: 'Transaction failed', blocking: false };
        }
      }
    },
    [
      client,
      getLatestBoc,
      getTransactionStatus,
      onGetGetTxByBOC,
      providerPool,
      sender,
      yourAddressWallet,
    ]
  );

  const onSendWithdrawTon = useCallback(
    async (poolJettonWalletAddress: string, decimals: number | undefined, amount: string) => {
      if (!poolJettonWalletAddress || !providerPool || !decimals)
        return { success: false, message: 'error', blocking: false };

      try {
        const dataMultiSig = await getMultiSig({
          isMock: false,
        });

        const parseAmount =
          Number(amount) === -1
            ? 1
            : parseUnits(valueToBigNumber(amount).toFixed(decimals), decimals).toString();

        const params = {
          queryId: Date.now(),
          poolJettonWalletAddress: Address.parse(poolJettonWalletAddress),
          amount: BigInt(parseAmount),
          priceData: dataMultiSig,
          isMaxWithdraw: Number(amount) === -1 ? true : false,
        };

        await providerPool.sendWithdraw(sender, params);

        const boc = await getLatestBoc();
        const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);

        if (txHash) {
          const status = await getTransactionStatus(txHash);
          return { success: status, txHash: txHash, blocking: !status, message: txHash };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.error('Transaction failed:', error);
        const errorToCheck = error.message.replace(/\s+/g, '').toLowerCase();
        if (_.includes(ErrorCancelledTon, errorToCheck)) {
          return {
            success: false,
            message: ErrorCancelledTon[0],
            blocking: false,
          };
        } else {
          return { success: false, message: 'Transaction failed', blocking: false };
        }
      }
    },
    [getLatestBoc, getTransactionStatus, onGetGetTxByBOC, providerPool, sender, yourAddressWallet]
  );

  const onSendRepayTokenTon = useCallback(
    async ({ amount, isAToken, interestRateMode, isJetton }: RepayParamsSend) => {
      if (!providerJettonMinter || !client || !interestRateMode || !providerPool)
        return { success: false, message: 'error', blocking: false };

      try {
        if (isJetton) {
          const walletAddressJettonMinter = await providerJettonMinter.getWalletAddress(
            Address.parse(yourAddressWallet)
          );

          const contractJettonWallet = new JettonWallet(
            walletAddressJettonMinter // z-ton-wallet
          );

          const providerJettonWallet = client.open(
            contractJettonWallet
          ) as OpenedContract<JettonWallet>;

          await providerJettonWallet.sendTransfer(
            sender, //via: Sender,
            toNano(`${GAS_FEE_TON}`), //value: bigint, --- gas fee default 1
            BigInt(amount), // User input amount
            Address.parse(address_pools), //Address poll
            Address.parse(yourAddressWallet), // User address wallet
            Cell.EMPTY, //
            toNano('0.1'), // forward_ton_amount: bigint,
            beginCell()
              .storeUint(Op.repay, 32)
              .storeBit(interestRateMode)
              .storeBit(isAToken)
              .storeBit(Number(amount) === -1 ? true : false)
              .endCell()
          );
        } else {
          const dataMultiSig = await getMultiSig({
            isMock: false,
          });
          const repayParams: RepayParams = {
            queryId: Date.now(),
            amount: BigInt(amount),
            useAToken: isAToken,
            isMax: false,
            priceData: dataMultiSig,
            interestRateMode: interestRateMode,
          };
          await providerPool.sendRepayTON(sender, repayParams);
        }

        return { success: true, message: 'success' };
      } catch (error) {
        console.log(error.message.replace(/\s+/g, '').toLowerCase());
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [client, providerJettonMinter, providerPool, sender, yourAddressWallet]
  );

  const onSendRepayATokenTon = useCallback(
    async ({ amount, isAToken, interestRateMode, isJetton }: RepayParamsSend) => {
      if (!providerJettonMinter || !client || !providerPool || !interestRateMode)
        return { success: false, message: 'error', blocking: false };

      try {
        const dataMultiSig = await getMultiSig({
          isMock: false,
        });

        if (isJetton) {
          const paramsRepay: RepayParams = {
            queryId: Date.now(),
            amount: BigInt(amount), // amount borrow
            poolJWRepay: await providerJettonMinter.getWalletAddress(Address.parse(address_pools)),
            poolJWCollateral: await providerJettonMinter.getWalletAddress(
              Address.parse(address_pools)
            ),
            interestRateMode: interestRateMode,
            useAToken: isAToken,
            isMax: false,
            priceData: dataMultiSig,
          };

          await providerPool.sendRepayUseAToken(
            sender, //via: Sender
            paramsRepay //via: Sender,
          );
        } else {
          const repayParams: RepayParams = {
            queryId: Date.now(),
            amount: BigInt(amount),
            useAToken: isAToken,
            isMax: false,
            priceData: dataMultiSig,
            interestRateMode: interestRateMode,
          };
          await providerPool.sendRepayTON(sender, repayParams);
        }

        return { success: true, message: 'success' };
      } catch (error) {
        console.log(error.message.replace(/\s+/g, '').toLowerCase());
        return { success: false, message: error.message.replace(/\s+/g, '').toLowerCase() };
      }
    },
    [client, providerJettonMinter, providerPool, sender]
  );

  const onSendRepayTon = useCallback(
    async ({
      amount,
      decimals,
      isMaxSelected,
      isAToken,
      isJetton,
      balance,
      debtType,
    }: RepayParamsSend) => {
      if (!decimals || !balance) return { success: false, message: 'error', blocking: false };
      try {
        const isBuffer =
          isMaxSelected &&
          valueToBigNumber(amount).multipliedBy(1.001).isLessThan(valueToBigNumber(balance));

        let res:
          | boolean
          | {
              success: boolean;
              message: string;
            }
          | undefined;

        const parseAmount =
          Number(amount) === -1
            ? 1
            : parseUnits(
                valueToBigNumber(amount)
                  .multipliedBy(isBuffer ? 1.001 : 1)
                  .toFixed(decimals),
                decimals
              ).toString();

        const interestRateMode = debtType === InterestRate.Stable ? 0 : 1; // 0 - INTEREST_MODE_STABLE  // 1 - INTEREST_MODE_VARIABLE

        const params = {
          amount: parseAmount,
          isAToken,
          interestRateMode,
          isJetton,
        };

        if (isAToken) res = await onSendRepayATokenTon(params);
        else res = await onSendRepayTokenTon(params);

        const boc = await getLatestBoc();
        const txHash = await onGetGetTxByBOC(boc, yourAddressWallet);

        if (txHash && !!res?.success) {
          const status = await getTransactionStatus(txHash);
          return {
            success: status,
            txHash: txHash,
            blocking: !status,
            message: txHash,
          };
        } else if (_.includes(ErrorCancelledTon, res?.message)) {
          return {
            success: false,
            message: ErrorCancelledTon[0],
            blocking: false,
          };
        } else {
          throw new Error('Transaction failed');
        }
      } catch (error) {
        console.log('error supply', error);
        return { success: false, message: 'Transaction failed', blocking: false };
      }
    },
    [
      getLatestBoc,
      getTransactionStatus,
      onGetGetTxByBOC,
      onSendRepayATokenTon,
      onSendRepayTokenTon,
      yourAddressWallet,
    ]
  );

  return {
    approvedAmountTonAssume,
    actionSendSupplyTon,
    onSendBorrowTon,
    onToggleCollateralTon,
    onSendWithdrawTon,
    onSendRepayTon,
  };
};
