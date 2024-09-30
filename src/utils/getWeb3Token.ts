import { useWeb3React } from '@web3-react/core';
import { getWithExpiry, setWithExpiry } from './expiracy';
import Web3Token from 'talken-web3-token';
import { setReferralApiToken } from './referral';

export const getWeb3Token = async (account: string, provider: any) => {
  if (account) {
    const tokenSigner = provider.getSigner(account);
    let token = getWithExpiry('w3token', account);
    if (!token) {
      // generating a token with 1 day of expiration time
      token = await Web3Token.sign(async (msg: string) => await tokenSigner.signMessage(msg), '1d');
      setWithExpiry('w3token', account, token, 86400 * 1000); // available for 1 day
    }

    setReferralApiToken(token);

    console.log('!! Web3Token = ', token);
    return token;
  } else {
    return null;
  }
};
