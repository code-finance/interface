import { Address } from '@ton/core';

export function getAssetHash(address: Address) {
  return BigInt('0x' + address.hash.toString('hex'));
}
