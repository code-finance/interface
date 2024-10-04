import axios from 'axios';

const referralApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REFERRAL_API_URL,
});

// referralApi.interceptors.request.use(
//   config => {
//     const w3Token = localStorage.getItem('w3token');
//     const parsedW3Token = w3Token ? JSON.parse(w3Token) : {};

//     if (parsedW3Token) {
//       config.headers['Authorization'] = `Bearer ${parsedW3Token.value}`;
//     }

//     return config;
//   },
//   error => {
//     Promise.reject(error);
//   },
// );

export const setReferralApiToken = (token: string) => {
  referralApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const registerReferral = (walletAddress: string) => {
  return referralApi.post(`/api/referral/${walletAddress}/register`);
};

export const getReferralCode = (walletAddress: string) => {
  return referralApi.get(`/api/referral/${walletAddress}`);
};

export const getReferralList = (walletAddress: string) => {
  return referralApi.get(`/api/referral/list/${walletAddress}`);
};

export const submitReferralCode = (walletAddress: string, referralCode: string) => {
  return referralApi.put(`/api/referral/${walletAddress}/setReferral`, {
    myReferral: referralCode,
  });
};

export const swapPoints = (walletAddress: string) => {
  return referralApi.post(`/api/claim/${walletAddress}`);
};

export const getPointWallet = (walletAddress: string) => {
  return referralApi.get(`/api/point/${walletAddress}`);
};

export const getTopReferral = (topSize: number) => {
  return referralApi.get(`/api/referral/top/${topSize}`);
};
