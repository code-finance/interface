import { Address, Sender, SenderArguments } from '@ton/core';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnectContext } from 'src/libs/hooks/useTonConnectContext';

let resBocTon = '';

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  getLatestBoc: () => string;
} {
  const [tonConnectUI] = useTonConnectUI();
  const { walletAddressTonWallet } = useTonConnectContext();

  return {
    sender: {
      send: async (args: SenderArguments): Promise<void> => {
        const response = await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });

        // Assuming response contains the transaction hash
        resBocTon = response.boc; // Adjust this line based on the actual response structure
      },
      address: Address.parse(walletAddressTonWallet),
    },
    connected: tonConnectUI?.connected,
    getLatestBoc: () => resBocTon,
  };
}
