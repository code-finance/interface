import { Address, beginCell, Cell, storeMessage } from '@ton/core';
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

  // const getTransactionStatus = useCallback(async (txHash: string) => {
  //   try {
  //     return await retry(
  //       async () => {
  //         try {
  //           const response = await axiosInstance.get<EventData>(
  //             `${API_TON_SCAN_V2}/events/${txHash}`
  //           );
  //           const { data } = response;

  //           // Check if the transaction is still in progress
  //           if (data.in_progress || !data) {
  //             console.log('Transaction in progress, retrying...');
  //             throw new Error('Transaction in progress, retrying...');
  //           }

  //           console.log(
  //             'Transaction-----',
  //             data.actions.every((item: Action) => item.status === 'ok', data)
  //           );

  //           // Verify if all actions have a status of 'ok'
  //           return data.actions.every((item: Action) => item.status === 'ok');
  //         } catch (apiError) {
  //           // Kiểm tra nếu lỗi là timeout thì ném ra và retry
  //           if (axios.isAxiosError(apiError) && apiError.code === 'ECONNABORTED') {
  //             console.log('Request timeout, retrying...', apiError.message);
  //             throw new Error('Timeout error, retrying...');
  //           }
  //           console.log('Error from API, retrying...', apiError);
  //           throw apiError; // Các lỗi khác cũng sẽ được retry
  //         }
  //       },
  //       {
  //         retries: 110, // Maximum number of retries
  //         delay: 5000, // Default delay of 5 seconds
  //       }
  //     );
  //   } catch (error) {
  //     console.log('Failed to get transaction status:', error);
  //     return false;
  //   }
  // }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const retryWithDelay = async (fn: () => Promise<any>, retries: number, delay: number) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error; // Ném lỗi nếu đã retry tối đa
        console.log(`Retrying... (${i + 1}/${retries})`);
        await new Promise((res) => setTimeout(res, delay)); // Delay trước khi retry
      }
    }
  };

  const getTransactionStatus = useCallback(async (txHash: string) => {
    try {
      return await retryWithDelay(
        async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 600000); // 10 phút

          try {
            console.log(`Starting request at: ${new Date().toISOString()}`);
            const response = await fetch(`${API_TON_SCAN_V2}/events/${txHash}`, {
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: EventData = await response.json();

            if (data.in_progress || !data) {
              console.log('Transaction in progress, retrying...');
              throw new Error('Transaction in progress, retrying...');
            }

            return data.actions.every((item: Action) => item.status === 'ok');
          } catch (apiError) {
            if (apiError.name === 'AbortError') {
              console.log('Request timeout, retrying...', apiError.message);
              throw new Error('Timeout error, retrying...');
            }
            console.log('Error from API, retrying...', apiError);
            throw apiError;
          } finally {
            clearTimeout(timeoutId); // Clear timeout
          }
        },
        110, // Maximum number of retries
        5000 // Delay of 5 seconds
      );
    } catch (error) {
      console.log('Failed to get transaction status:', error);
      return false;
    }
  }, []);

  return {
    onGetGetTxByBOC,
    getTransactionStatus,
  };
}
