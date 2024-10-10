import { Address, Cell } from '@ton/core';

export type JettonMinterContent = {
  type: 0 | 1;
  uri: string;
};

export type JettonMetaDataKeys =
  | 'name'
  | 'description'
  | 'image'
  | 'symbol'
  | 'image_data'
  | 'decimals'
  | 'uri';

export type JettonMinterConfig = {
  admin: Address;
  jettonWalletCode: Cell;
  offchainUri?: string;
  metadata?: { [s in JettonMetaDataKeys]?: string | undefined };
};
