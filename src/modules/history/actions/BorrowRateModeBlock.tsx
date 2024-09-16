import { Trans } from '@lingui/macro';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import React from 'react';

import { ActionFields, TransactionHistoryItem } from '../types';

export const BorrowRateModeBlock = ({
  swapBorrowRateTx,
  borrowRateMode,
}: {
  swapBorrowRateTx: TransactionHistoryItem<ActionFields['SwapBorrowRate']>;
  borrowRateMode: string;
}) => {
  const xsm = useMediaQuery(useTheme().breakpoints.up('xsm'));
  const typographyVariant2 = xsm ? 'body3' : 'body7';
  if (borrowRateMode === 'Variable' || borrowRateMode === '2') {
    return (
      <>
        <Typography variant={typographyVariant2} color="text.primary" pr={0.5}>
          <Trans>Variable</Trans>
        </Typography>
        <Typography variant={typographyVariant2} color="text.primary" pr={0.5}>
          {Number(formatUnits(swapBorrowRateTx.variableBorrowRate, 25)).toFixed(2)}%
        </Typography>
        <Typography variant={typographyVariant2} color="text.primary">
          <Trans>APY</Trans>
        </Typography>
      </>
    );
  } else {
    return (
      <>
        <Typography variant={typographyVariant2} color="text.primary" pr={0.5}>
          <Trans>Stable</Trans>
        </Typography>
        <Typography variant={typographyVariant2} color="text.primary" pr={0.5}>
          {Number(formatUnits(swapBorrowRateTx.stableBorrowRate, 25)).toFixed(2)}%
        </Typography>
        <Typography variant={typographyVariant2} color="text.primary">
          <Trans>APY</Trans>
        </Typography>
      </>
    );
  }
};
