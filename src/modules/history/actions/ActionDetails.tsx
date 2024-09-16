import { ArrowNarrowRightIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import { Box, SvgIcon, Typography, useMediaQuery, useTheme } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import React from 'react';
import { DarkTooltip } from 'src/components/infoTooltips/DarkTooltip';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';

import { BorrowRateModeBlock } from '../actions/BorrowRateModeBlock';
import { fetchIconSymbolAndNameHistorical } from '../helpers';
import { PriceUnavailable } from '../PriceUnavailable';
import { ActionFields, TransactionHistoryItem } from '../types';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

export const ActionTextMap = ({ action }: { action: string }) => {
  switch (action) {
    case 'Supply':
    case 'Deposit':
      return <Trans>Supply</Trans>;
    case 'Borrow':
      return <Trans>Borrow</Trans>;
    case 'RedeemUnderlying':
      return <Trans>Withdraw</Trans>;
    case 'Repay':
      return <Trans>Repay</Trans>;
    case 'UsageAsCollateral':
      return <Trans>Collateral usage</Trans>;
    case 'SwapBorrowRate':
    case 'Swap':
      return <Trans>Borrow rate change</Trans>;
    case 'LiquidationCall':
      return <Trans>Liquidation</Trans>;
    default:
      return <></>;
  }
};

export const ActionDetails = <K extends keyof ActionFields>({
  transaction,
  iconSize,
}: {
  transaction: TransactionHistoryItem<ActionFields[K]>;
  iconSize: string;
}) => {
  const xsm = useMediaQuery(useTheme().breakpoints.up('xsm'));
  const typographyVariant = xsm ? 'body1' : 'body2';
  const typographyVariant2 = xsm ? 'body3' : 'body7';
  switch (transaction.action) {
    case 'Supply':
    case 'Deposit':
      const supplyTx = transaction as TransactionHistoryItem<ActionFields['Supply']>;
      const formattedSupplyReserve = fetchIconSymbolAndNameHistorical(supplyTx.reserve);
      const formattedSupplyAmount = formatUnits(supplyTx.amount, supplyTx.reserve.decimals);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TokenIcon symbol={formattedSupplyReserve.iconSymbol} sx={{ fontSize: iconSize }} />
          <AddCircleOutline
            sx={(theme) => ({
              color: theme.palette.point.positive,
              fontSize: { xs: 18, xsm: 22 },
              mx: { xs: '7px', xsm: '11px' },
            })}
          />
          <DarkTooltip
            wrap
            title={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PriceUnavailable
                  value={Number(supplyTx.assetPriceUSD) * Number(formattedSupplyAmount)}
                />
                <Box sx={{ display: 'flex' }}>
                  <FormattedNumber
                    value={formattedSupplyAmount}
                    variant={typographyVariant}
                    color="common.white"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant={typographyVariant} color="common.white">
                    {formattedSupplyReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedSupplyAmount}
                variant={typographyVariant}
                color="text.primary"
                compact
                compactThreshold={100000}
                sx={{ mr: 2 }}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant={typographyVariant} color="text.primary">
                {formattedSupplyReserve.name} ({formattedSupplyReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant={typographyVariant} color="text.primary">
              {formattedSupplyReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'Borrow':
      const borrowTx = transaction as TransactionHistoryItem<ActionFields['Borrow']>;
      const formattedBorrowReserve = fetchIconSymbolAndNameHistorical(borrowTx.reserve);
      const formattedBorrowAmount = formatUnits(borrowTx.amount, borrowTx.reserve.decimals);
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <TokenIcon symbol={formattedBorrowReserve.iconSymbol} sx={{ fontSize: iconSize }} />
          <RemoveCircleOutline
            sx={(theme) => ({
              color: theme.palette.point.negative,
              fontSize: { xs: 18, xsm: 22 },
              mx: { xs: '7px', xsm: '11px' },
            })}
          />
          <DarkTooltip
            wrap
            title={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PriceUnavailable
                  value={Number(borrowTx.assetPriceUSD) * Number(formattedBorrowAmount)}
                />
                <Box sx={{ display: 'flex' }}>
                  <FormattedNumber
                    value={formattedBorrowAmount}
                    variant={typographyVariant}
                    color="text.primary"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant={typographyVariant} color="text.primary">
                    {formattedBorrowReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedBorrowAmount}
                variant={typographyVariant}
                color="text.primary"
                sx={{ mr: 2 }}
                compact
                compactThreshold={100000}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant={typographyVariant} color="text.primary">
                {formattedBorrowReserve.name} ({formattedBorrowReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant={typographyVariant} color="text.primary">
              {formattedBorrowReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'RedeemUnderlying':
      const withdrawTx = transaction as TransactionHistoryItem<ActionFields['RedeemUnderlying']>;
      const formattedWithdrawReserve = fetchIconSymbolAndNameHistorical(withdrawTx.reserve);
      const formattedWithdrawAmount = formatUnits(withdrawTx.amount, withdrawTx.reserve.decimals);
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <TokenIcon symbol={formattedWithdrawReserve.iconSymbol} sx={{ fontSize: iconSize }} />
          <RemoveCircleOutline
            sx={(theme) => ({
              color: theme.palette.point.negative,
              fontSize: { xs: 18, xsm: 22 },
              mx: { xs: '7px', xsm: '11px' },
            })}
          />
          <DarkTooltip
            wrap
            title={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PriceUnavailable
                  value={Number(withdrawTx.assetPriceUSD) * Number(formattedWithdrawAmount)}
                />
                <Box sx={{ display: 'flex' }}>
                  <FormattedNumber
                    value={formattedWithdrawAmount}
                    variant={typographyVariant}
                    color="text.primary"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant={typographyVariant} color="text.primary">
                    {formattedWithdrawReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedWithdrawAmount}
                variant={typographyVariant}
                color="text.primary"
                sx={{ mr: 2 }}
                compact
                compactThreshold={100000}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant={typographyVariant} color="text.primary">
                {formattedWithdrawReserve.name} ({formattedWithdrawReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant={typographyVariant} color="text.primary">
              {formattedWithdrawReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'Repay':
      const repayTx = transaction as TransactionHistoryItem<ActionFields['Repay']>;
      const formattedRepayReserve = fetchIconSymbolAndNameHistorical(repayTx.reserve);
      const formattedRepayAmount = formatUnits(repayTx.amount, repayTx.reserve.decimals);
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <TokenIcon symbol={formattedRepayReserve.iconSymbol} sx={{ fontSize: iconSize }} />
          <AddCircleOutline
            sx={(theme) => ({
              color: theme.palette.point.positive,
              fontSize: { xs: 18, xsm: 22 },
              mx: { xs: '7px', xsm: '11px' },
            })}
          />
          <DarkTooltip
            wrap
            title={
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PriceUnavailable
                  value={Number(repayTx.assetPriceUSD) * Number(formattedRepayAmount)}
                />
                <Box sx={{ display: 'flex' }}>
                  <FormattedNumber
                    value={formattedRepayAmount}
                    variant={typographyVariant}
                    color="text.primary"
                    sx={{ mr: 2 }}
                  />
                  <Typography variant={typographyVariant} color="text.primary">
                    {formattedRepayReserve.symbol}
                  </Typography>
                </Box>
              </Box>
            }
            arrow
            placement="top"
          >
            <Box>
              <FormattedNumber
                value={formattedRepayAmount}
                variant={typographyVariant}
                color="text.primary"
                sx={{ mr: 2 }}
                compact
                compactThreshold={100000}
              />
            </Box>
          </DarkTooltip>
          <DarkTooltip
            title={
              <Typography variant={typographyVariant} color="text.primary">
                {formattedRepayReserve.name} ({formattedRepayReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant={typographyVariant} color="text.primary">
              {formattedRepayReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'UsageAsCollateral':
      const collateralUsageTx = transaction as TransactionHistoryItem<
        ActionFields['UsageAsCollateral']
      >;
      const formattedCollateralReserve = fetchIconSymbolAndNameHistorical(
        collateralUsageTx.reserve
      );
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography variant={typographyVariant2} color="text.primary">
            <Trans>Collateralization</Trans>
          </Typography>
          {collateralUsageTx.toState ? (
            <Typography variant={typographyVariant2} color="text.primary" sx={{ px: 0.75 }}>
              <Trans>enabled</Trans>
            </Typography>
          ) : (
            <Typography variant={typographyVariant2} color="error.main" sx={{ px: 0.75 }}>
              <Trans>disabled</Trans>
            </Typography>
          )}
          <Typography variant={typographyVariant2} color="text.primary" sx={{ mr: 0.5 }}>
            <Trans>for</Trans>
          </Typography>
          <TokenIcon
            symbol={formattedCollateralReserve.iconSymbol}
            sx={{
              fontSize: iconSize,
            }}
          />
          <DarkTooltip
            title={
              <Typography variant={typographyVariant} color="text.primary">
                {formattedCollateralReserve.name} ({formattedCollateralReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography
              variant={typographyVariant}
              color="text.primary"
              sx={{ ml: formattedCollateralReserve.iconSymbol.split('_').length > 1 ? 3 : 1 }}
            >
              {formattedCollateralReserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'SwapBorrowRate':
    case 'Swap':
      const swapBorrowRateTx = transaction as TransactionHistoryItem<
        ActionFields['SwapBorrowRate']
      >;
      const formattedSwapReserve = fetchIconSymbolAndNameHistorical(swapBorrowRateTx.reserve);
      return (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%',
            overflow: 'hidden',
            gap: 1,
          }}
        >
          <BorrowRateModeBlock
            borrowRateMode={swapBorrowRateTx.borrowRateModeFrom.toString()}
            swapBorrowRateTx={swapBorrowRateTx}
          />
          <SvgIcon sx={{ fontSize: '20px' }}>
            <ArrowNarrowRightIcon />
          </SvgIcon>
          <BorrowRateModeBlock
            borrowRateMode={swapBorrowRateTx.borrowRateModeTo.toString()}
            swapBorrowRateTx={swapBorrowRateTx}
          />
          <Typography variant={typographyVariant2} color="text.primary">
            <Trans>for</Trans>
          </Typography>
          <TokenIcon symbol={formattedSwapReserve.iconSymbol} sx={{ fontSize: iconSize }} />
          <DarkTooltip
            title={
              <Typography variant={typographyVariant2} color="text.primary">
                {formattedSwapReserve.name} ({formattedSwapReserve.symbol})
              </Typography>
            }
            arrow
            placement="top"
          >
            <Typography variant={typographyVariant2} color="text.primary">
              {swapBorrowRateTx.reserve.symbol}
            </Typography>
          </DarkTooltip>
        </Box>
      );
    case 'LiquidationCall':
      const liquidationTx = transaction as TransactionHistoryItem<ActionFields['LiquidationCall']>;
      const formattedLiquidationColatReserve = fetchIconSymbolAndNameHistorical(
        liquidationTx.collateralReserve
      );
      const formattedLiquidationBorrowReserve = fetchIconSymbolAndNameHistorical(
        liquidationTx.principalReserve
      );
      const formattedCollateralAmount = formatUnits(
        liquidationTx.collateralAmount,
        liquidationTx.collateralReserve.decimals
      );
      const formattedLiquidationBorrowAmount = formatUnits(
        liquidationTx.principalAmount,
        liquidationTx.principalReserve.decimals
      );
      return (
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: { xs: 3, sxm: '18px' },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={typographyVariant2} color="text.primary">
              <Trans>Liquidated collateral</Trans>
            </Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <TokenIcon
                symbol={formattedLiquidationColatReserve.iconSymbol}
                sx={{ fontSize: iconSize, mr: 0.5 }}
              />
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <RemoveCircleOutline
                  sx={(theme) => ({
                    color: theme.palette.point.negative,
                    fontSize: { xs: 18, xsm: 22 },
                    mx: { xs: '3px', xsm: '7px' },
                  })}
                />
                <DarkTooltip
                  wrap
                  title={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <PriceUnavailable
                        value={
                          Number(liquidationTx.collateralAssetPriceUSD) *
                          Number(formattedCollateralAmount)
                        }
                      />
                      <Box sx={{ display: 'flex' }}>
                        <FormattedNumber
                          value={formattedCollateralAmount}
                          variant={typographyVariant}
                          color="text.primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant={typographyVariant} color="text.primary">
                          {formattedLiquidationColatReserve.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box>
                    <FormattedNumber
                      value={formattedCollateralAmount}
                      variant={typographyVariant}
                      color="text.primary"
                      sx={{ mr: 1 }}
                      compact
                      compactThreshold={100000}
                    />
                  </Box>
                </DarkTooltip>
                <DarkTooltip
                  title={
                    <Typography variant={typographyVariant} color="text.primary">
                      {formattedLiquidationColatReserve.name} (
                      {formattedLiquidationColatReserve.symbol})
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant={typographyVariant}
                    color="text.primary"
                    sx={{ display: 'inline-flex', alignItems: 'center' }}
                  >
                    {formattedLiquidationColatReserve.symbol}
                  </Typography>
                </DarkTooltip>
              </Box>
            </Box>
          </Box>
          <SvgIcon sx={{ fontSize: iconSize }}>
            <ArrowNarrowRightIcon />
          </SvgIcon>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant={typographyVariant2} color="text.primary">
              <Trans>Covered debt</Trans>
            </Typography>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <TokenIcon
                symbol={formattedLiquidationBorrowReserve.iconSymbol}
                sx={{ fontSize: iconSize, md: 0.5 }}
              />
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <AddCircleOutline
                  sx={(theme) => ({
                    color: theme.palette.point.positive,
                    fontSize: { xs: 18, xsm: 22 },
                    mx: { xs: '3px', xsm: '7px' },
                  })}
                />
                <DarkTooltip
                  wrap
                  title={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <PriceUnavailable
                        value={
                          Number(liquidationTx.borrowAssetPriceUSD) *
                          Number(formattedLiquidationBorrowAmount)
                        }
                      />
                      <Box sx={{ display: 'flex' }}>
                        <FormattedNumber
                          value={formattedLiquidationBorrowAmount}
                          variant={typographyVariant}
                          color="text.primary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant={typographyVariant} color="text.primary">
                          {formattedLiquidationBorrowReserve.symbol}
                        </Typography>
                      </Box>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <Box>
                    <FormattedNumber
                      value={formattedLiquidationBorrowAmount}
                      variant={typographyVariant}
                      color="text.primary"
                      sx={{ mr: 1 }}
                      compact
                      compactThreshold={100000}
                    />
                  </Box>
                </DarkTooltip>
                <DarkTooltip
                  title={
                    <Typography variant={typographyVariant} color="text.primary">
                      {formattedLiquidationBorrowReserve.name} (
                      {formattedLiquidationBorrowReserve.symbol})
                    </Typography>
                  }
                  arrow
                  placement="top"
                >
                  <Typography
                    variant={typographyVariant}
                    color="text.primary"
                    sx={{ display: 'inline-flex' }}
                  >
                    {formattedLiquidationBorrowReserve.symbol}
                  </Typography>
                </DarkTooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    default:
      return <></>;
  }
};
