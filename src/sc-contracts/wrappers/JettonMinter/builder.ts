import { beginCell, Cell } from '@ton/core';

import { buildJettonOffChainMetadata, buildJettonOnChainMetadata } from './helpers';
import { JettonMinterConfig, JettonMinterContent } from './types';

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  if (!config.offchainUri && !config.metadata) {
    throw new Error('Must either specify onchain data or offchain uri');
  }

  return beginCell()
    .storeCoins(0)
    .storeAddress(config.admin)
    .storeRef(
      config.offchainUri
        ? buildJettonOffChainMetadata(config.offchainUri)
        : buildJettonOnChainMetadata(config.metadata!)
    )
    .storeRef(config.jettonWalletCode)
    .endCell();
}

export function jettonContentToCell(content: JettonMinterContent) {
  return beginCell()
    .storeUint(content.type, 8)
    .storeStringTail(content.uri) // Snake logic under the hood
    .endCell();
}
