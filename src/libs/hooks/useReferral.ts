import { useQuery } from '@tanstack/react-query';
import { getReferralCode } from 'src/utils/referral';
import { useWeb3Context } from './useWeb3Context';
import { useMemo } from 'react';

export const useReferral = () => {
  const { currentAccount } = useWeb3Context();

  const queryRes = useQuery({
    queryKey: [`/api/referral/${currentAccount}`],
    queryFn: () => getReferralCode(currentAccount),
    enabled: !!currentAccount,
    staleTime: Infinity,
  });

  return useMemo(
    () => ({
      ...queryRes,
      referralData: queryRes.data?.data?.data || {},
    }),
    [queryRes]
  );
};
