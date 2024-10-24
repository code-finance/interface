import { InterestRate } from '@aave/contract-helpers';
import { Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { UserAuthenticated } from 'src/components/UserAuthenticated';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { ModalContextType, ModalType, useModalContext } from 'src/hooks/useModal';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { isFeatureEnabled } from 'src/utils/marketsAndNetworksConfig';

import { BasicModal } from '../../primitives/BasicModal';
import { ModalWrapper } from '../FlowCommons/ModalWrapper';
import { CollateralRepayModalContent } from './CollateralRepayModalContent';
import { RepayModalContent } from './RepayModalContent';
import { RepayType, RepayTypeSelector } from './RepayTypeSelector';

export const RepayModal = () => {
  const { type, close, args, mainTxState } = useModalContext() as ModalContextType<{
    underlyingAsset: string;
    currentRateMode: InterestRate;
    isFrozen: boolean;
  }>;
  const { userReserves, user } = useAppDataContext();
  const { currentMarketData } = useProtocolDataContext();
  const [repayType, setRepayType] = useState(RepayType.BALANCE);

  // repay with collateral is only possible:
  // 1. on chains with paraswap deployed
  // 2. when you have a different supplied(not necessarily collateral) asset then the one your debt is in
  // For repaying your debt with the same assets aToken you can use repayWithAToken on aave protocol v3
  const collateralRepayPossible =
    isFeatureEnabled.collateralRepay(currentMarketData) &&
    userReserves.some(
      (userReserve) =>
        userReserve.scaledATokenBalance !== '0' &&
        userReserve.underlyingAsset !== args.underlyingAsset
    );

  const handleClose = () => {
    setRepayType(RepayType.BALANCE);
    close();
  };

  const checkUserReservesData = (): boolean => {
    const filteredArray =
      user && user?.userReservesData.filter((item) => item.underlyingBalance !== '0');
    if (
      filteredArray &&
      filteredArray.length === 1 &&
      filteredArray[0].underlyingAsset === args.underlyingAsset
    ) {
      return false;
    }
    return true;
  };

  const isShowCollateralTON =
    isFeatureEnabled.collateralRepay(currentMarketData) &&
    !mainTxState.txHash &&
    user &&
    user?.userReservesData.some(
      (userReserve) =>
        userReserve.scaledATokenBalance !== '0' &&
        userReserve.underlyingAsset !== args.underlyingAsset
    ) &&
    checkUserReservesData();

  useEffect(() => {
    if (repayType === RepayType.COLLATERAL && !isShowCollateralTON && user) {
      setRepayType(RepayType.BALANCE);
    }
  }, [mainTxState.txHash, repayType, isShowCollateralTON, user]);

  return (
    <BasicModal open={type === ModalType.Repay} setOpen={handleClose}>
      <ModalWrapper title={<Trans>Repay</Trans>} underlyingAsset={args.underlyingAsset}>
        {(params) => {
          return (
            <UserAuthenticated>
              {(user) => (
                <>
                  {(collateralRepayPossible && !mainTxState.txHash) ||
                    (isShowCollateralTON && (
                      <RepayTypeSelector repayType={repayType} setRepayType={setRepayType} />
                    ))}
                  {repayType === RepayType.BALANCE && (
                    <RepayModalContent {...params} debtType={args.currentRateMode} user={user} />
                  )}
                  {repayType === RepayType.COLLATERAL && isShowCollateralTON && (
                    <CollateralRepayModalContent
                      {...params}
                      debtType={args.currentRateMode}
                      user={user}
                    />
                  )}
                </>
              )}
            </UserAuthenticated>
          );
        }}
      </ModalWrapper>
    </BasicModal>
  );
};
