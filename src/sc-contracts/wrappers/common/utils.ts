import { Address, beginCell, Cell, Dictionary } from '@ton/core';
import { KeyPair, mnemonicToPrivateKey } from '@ton/crypto';

export type DataPrice = {
  usd: string;
  decimal: bigint;
  symbol: string;
  priceNumber: number;
  timestamp: number;
  address: Address;
  signature: Buffer;
};

export async function getPublicKey() {
  // TODO get from BE api
  return (await getKeyPair()).publicKey;
}

export async function getKeyPair(): Promise<KeyPair> {
  const mnemonic =
    'tooth file stomach split degree van excite sausage soup simple onion merry list depend keep garbage admit client engine other expose six put curious';
  // TODO get from BE api
  const mnemonicsString = process.env.WALLET_MNEMONIC_BE ?? mnemonic;
  const kpBE = await mnemonicToPrivateKey(mnemonicsString.split(' '));
  return kpBE;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getPrice(symbol: any): Promise<DataPrice> {
  const res = await fetch('https://aave-ton-api.sotatek.works/crawler/price');
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataFilter: any = Object.values(data).filter((item: any) => item.symbol == symbol)[0];

  return {
    usd: dataFilter.usd ?? '',
    decimal: dataFilter.decimal ?? 0,
    timestamp: dataFilter.timestamp ?? 0,
    symbol: dataFilter.symbol ?? '',
    priceNumber: dataFilter.priceNumber ?? 0,
    address: dataFilter.address ?? NaN,
    signature: Buffer.from(dataFilter.signature ?? '', 'hex'),
  };
}

export async function getPriceAll(): Promise<DataPrice[]> {
  const res = await fetch('https://aave-ton-api.sotatek.works/crawler/price');
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resultPrices: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(data).forEach((item: any) => {
    const resultItem: DataPrice = {
      usd: item.usd ?? '',
      decimal: item.decimal ?? 0,
      timestamp: item.timestamp ?? 0,
      symbol: item.symbol ?? '',
      priceNumber: item.priceNumber ?? 0,
      address: item.address ?? NaN,
      signature: Buffer.from(item.signature ?? '', 'hex'),
    };
    resultPrices.push(resultItem);
  });

  return resultPrices;
}

export type ResultPriceSig = {
  price_data: Cell;
  sig: Buffer;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getSig(symbol: any): Promise<ResultPriceSig> {
  const priceAPI = await getPrice(symbol);
  // priceAPI.signature  fb79bbe1959f7d
  const dataPrice = beginCell()
    .storeInt(priceAPI.priceNumber, 64)
    .storeInt(priceAPI.timestamp, 64)
    .storeAddress(Address.parse(priceAPI.address.toString()))
    .endCell();

  return { price_data: dataPrice, sig: priceAPI.signature };
}

/* listJettonAddressMock: need for mock test script
const listJettonAddressMock = {
    isMock : true,
    TON : pool.address,
    USDT : USDT.address,
    USDC : USDC.address,
    DAI : DAI.address,
}; */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getMultiSig(listJettonAddressMock: any): Promise<Dictionary<bigint, Cell>> {
  const KEYLEN = 256;
  const dict = Dictionary.empty(Dictionary.Keys.BigUint(KEYLEN), Dictionary.Values.Cell());

  const res = await fetch('https://aave-ton-api.sotatek.works/crawler/price');
  const data = await res.json();

  // console.log('data', data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(data).forEach((item: any) => {
    const resultItem: DataPrice = {
      usd: item.usd ?? '',
      decimal: item.decimal ?? 0,
      timestamp: item.timestamp ?? 0,
      symbol: item.symbol ?? '',
      priceNumber: item.priceNumber ?? 0,
      address: item.address ?? NaN,
      signature: Buffer.from(item.signature ?? '', 'hex'),
    };

    const dataPriceToCell = beginCell()
      .storeInt(resultItem.priceNumber, 64)
      .storeInt(resultItem.timestamp, 64)
      .storeAddress(Address.parse(resultItem.address.toString()))
      .endCell();
    const itemDict = beginCell()
      .storeRef(dataPriceToCell)
      .storeBuffer(resultItem.signature)
      .endCell();

    let assetHash = BigInt(
      '0x' + Address.parse(resultItem.address.toString()).hash.toString('hex')
    );
    // console.log('assetHash real ', assetHash);

    if (listJettonAddressMock.isMock) {
      assetHash = BigInt(
        '0x' +
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Address.parse(listJettonAddressMock[resultItem.symbol as any].toString()).hash.toString(
            'hex'
          )
      );
    }

    dict.set(assetHash, itemDict);
  });

  return dict;
}
