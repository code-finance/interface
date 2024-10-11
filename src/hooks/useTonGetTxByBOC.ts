import { Address, beginCell, Cell, storeMessage } from '@ton/core';
import axios from 'axios';
import { reject } from 'lodash';
import { useCallback } from 'react';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';
import { retry } from 'ts-retry-promise';

import { API_TON_SCAN_V2 } from './app-data-provider/useAppDataProviderTon';
import { useTonClientV2 } from './useTonClient';

type EventData = {
  event_id: string;
  timestamp: number;
  actions: Action[];
  is_scam: boolean;
  lt: number;
  in_progress: boolean;
};
export interface Action {
  type: string;
  status: string;
}

export default function convertHexToBase64(hexString: string) {
  const buffer = Buffer.from(hexString, 'hex');

  return buffer.toString('base64');
}

export function useTonGetTxByBOC() {
  const { walletAddressTonWallet } = useTonConnectContext();
  const client = useTonClientV2();

  const onGetGetTxByBOC = useCallback(
    async (exBoc: string, _add: string) => {
      if (!client || !walletAddressTonWallet || !_add || !exBoc) return;
      const myAddress = Address.parse(_add);
      return retry(
        async () => {
          const transactions = await client.getTransactions(myAddress, {
            limit: 5,
          });
          for (const tx of transactions) {
            const inMsg = tx.inMessage;
            if (inMsg?.info.type === 'external-in') {
              const inBOC = inMsg?.body;
              if (typeof inBOC === 'undefined') {
                reject(new Error('Invalid external'));
                continue;
              }
              const extHash = Cell.fromBase64(exBoc).hash().toString('hex');
              const inHash = beginCell()
                .store(storeMessage(inMsg))
                .endCell()
                .hash()
                .toString('hex');

              // console.log(' hash BOC', extHash);
              console.log('inMsg hash', inHash);
              // console.log('checking the tx', tx, tx.hash().toString('hex'));

              // Assuming `inBOC.hash()` is synchronous and returns a hash object with a `toString` method
              if (extHash === inHash) {
                // console.log('Tx match');
                const txHash = tx.hash().toString('hex');
                console.log(`Transaction Hash: ${txHash}`);
                // console.log(`Transaction LT: ${tx.lt}`);
                return txHash;
              }
            }
          }
          throw new Error('Transaction not found');
        },
        { retries: 50, delay: 1000 }
      );
    },
    [client, walletAddressTonWallet]
  );

  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      return await retry(
        async () => {
          const { data } = await axios.get<EventData>(`${API_TON_SCAN_V2}/events/${txHash}`);

          // Check if the transaction is still in progress
          if (data.in_progress) {
            console.log('Transaction in progress, retrying...');
            throw new Error('Transaction in progress, retrying...');
          }

          console.log(
            'Transaction-----',
            data.actions.every((item: Action) => item.status === 'ok')
          );
          // Verify if all actions have a status of 'ok'
          return data.actions.every((item: Action) => item.status === 'ok');
        },
        {
          retries: 100, // Maximum number of retries
          delay: 3000, // Delay between retries (3 seconds)
        }
      );
    } catch (error) {
      return false;
    }
  }, []);

  return {
    onGetGetTxByBOC,
    getTransactionStatus,
  };
}
