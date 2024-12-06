import { Address, beginCell, Dictionary } from '@ton/core';
import dotenv from 'dotenv';
import { URL_API_BE } from 'src/helpers/ton-export';
import { getAssetHash } from './getAssetHash';
import { Jettons } from '../types';

dotenv.config();

async function getPrices() {
  if (!URL_API_BE) {
    throw new Error('GET_PRICE_URL is not defined');
  }

  const ENDPOINT = `${URL_API_BE}/crawler/price`;
  try {
    const res = await fetch(ENDPOINT);
    const prices = await res.json();
    return prices;
  } catch (error) {
    console.error('Error fetching price data:', error);
  }
}

export async function getPriceData() {
  const prices = await getPrices();
  const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(prices).forEach((price: any) => {
    const address = Address.parse(price.address);

    if (!price) {
      return;
    }

    const priceData = beginCell()
      .storeUint(price.priceNumber, 64)
      .storeUint(price.timestamp, 64)
      .storeBuffer(Buffer.from(price.signature, 'hex'))
      .endCell();

    const assetHash = getAssetHash(address);
    dict.set(assetHash, priceData);
  });

  return dict;
}

export async function getMockPriceData(assets?: Jettons, tonPrice?: string) {
  const dict = Dictionary.empty(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());
  return dict;
}
