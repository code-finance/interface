import { Trans } from '@lingui/macro';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputBase,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material';
import React, { ReactNode } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { TrackEventProps } from 'src/store/analyticsSlice';
import { useRootStore } from 'src/store/root';

import { CapType } from '../caps/helper';
import { AvailableTooltip } from '../infoTooltips/AvailableTooltip';
import { FormattedNumber } from '../primitives/FormattedNumber';
import { TokenIcon } from '../primitives/TokenIcon';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormatProps, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          if (values.value !== props.value)
            onChange({
              target: {
                name: props.name,
                value: values.value || '',
              },
            });
        }}
        thousandSeparator
        isNumericString
        allowNegative={false}
      />
    );
  }
);

export interface Asset {
  balance?: string;
  symbol: string;
  iconSymbol?: string;
  address?: string;
  aToken?: boolean;
  priceInUsd?: string;
  decimals?: number;
}

export interface AssetInputProps<T extends Asset = Asset> {
  value: string;
  usdValue: string;
  symbol: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  disableInput?: boolean;
  onSelect?: (asset: T) => void;
  assets: T[];
  capType?: CapType;
  maxValue?: string;
  isMaxSelected?: boolean;
  inputTitle?: ReactNode;
  balanceText?: ReactNode;
  loading?: boolean;
  event?: TrackEventProps;
  selectOptionHeader?: ReactNode;
  selectOption?: (asset: T) => ReactNode;
  sx?: BoxProps;
  exchangeRateComponent?: ReactNode;
}

export const AssetInput = <T extends Asset = Asset>({
  value,
  usdValue,
  symbol,
  onChange,
  disabled,
  disableInput,
  onSelect,
  assets,
  capType,
  maxValue,
  isMaxSelected,
  inputTitle,
  balanceText,
  loading = false,
  event,
  selectOptionHeader,
  selectOption,
  sx = {},
  exchangeRateComponent,
}: AssetInputProps<T>) => {
  const theme = useTheme();
  const trackEvent = useRootStore((store) => store.trackEvent);
  const handleSelect = (event: SelectChangeEvent) => {
    const newAsset = assets.find((asset) => asset.symbol === event.target.value) as T;
    onSelect && onSelect(newAsset);
    onChange && onChange('');
  };

  const asset =
    assets.length === 1
      ? assets[0]
      : assets && (assets.find((asset) => asset.symbol === symbol) as T);

  return (
    <Box {...sx}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="body7" color="text.secondary">
          {inputTitle ? inputTitle : <Trans>Amount</Trans>}
        </Typography>
        {capType && <AvailableTooltip capType={capType} color="text.secondary" iconSize={16} />}
      </Box>
      <Box
        sx={(theme) => ({
          border: `1px solid ${theme.palette.border.divider}`,
          borderRadius: '8px',
          overflow: 'hidden',
          padding: 4,
          display: 'flex',
          gap: '12px',
          flexDirection: 'column',
        })}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: value !== '' && !disableInput ? 2 : 10,
          }}
        >
          {loading ? (
            <Box sx={{ flex: 1 }}>
              <CircularProgress color="inherit" size="16px" />
            </Box>
          ) : (
            <InputBase
              sx={{
                flex: 1,
                'input::placeholder': {
                  color: theme.palette.text.disabledText,
                },
              }}
              placeholder="0.00"
              disabled={disabled || disableInput}
              value={value}
              autoFocus
              onChange={(e) => {
                if (!onChange) return;
                if (Number(e.target.value) > Number(maxValue)) {
                  onChange('-1');
                } else {
                  onChange(e.target.value);
                }
              }}
              inputProps={{
                'aria-label': 'amount input',

                style: {
                  textOverflow: 'ellipsis',
                  padding: 0,
                  ...theme.typography.body8,
                  color: theme.palette.text.primary,
                },
              }}
              // eslint-disable-next-line
              inputComponent={NumberFormatCustom as any}
            />
          )}
          {value !== '' && !disableInput && (
            <IconButton
              sx={{
                minWidth: 0,
                p: 0,
                left: 8,
                zIndex: 1,
                color: 'text.subText',
                '&:hover': {
                  color: 'text.disabledBg',
                },
              }}
              onClick={() => {
                onChange && onChange('');
              }}
              disabled={disabled}
            >
              <CancelIcon height={24} width={24} />
            </IconButton>
          )}
          {!onSelect || assets.length === 1 ? (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
              <TokenIcon
                aToken={asset.aToken}
                symbol={asset.iconSymbol || asset.symbol}
                sx={{ ml: 3, width: '24px', height: '24px' }}
              />
              <Typography variant="body5" color="text.primary" data-cy={'inputAsset'}>
                {symbol}
              </Typography>
            </Box>
          ) : (
            <FormControl
              sx={{
                '.MuiSelect-select': {
                  height: 'unset',
                },
              }}
            >
              <Select
                disabled={disabled}
                value={asset.symbol}
                onChange={handleSelect}
                variant="outlined"
                className="AssetInput__select"
                data-cy={'assetSelect'}
                MenuProps={{
                  sx: {
                    maxHeight: '240px',
                    '.MuiPaper-root': {
                      border: theme.palette.mode === 'dark' ? '1px solid #EBEBED1F' : 'unset',
                      boxShadow: '0px 2px 10px 0px #0000001A',
                    },
                  },
                }}
                sx={{
                  p: 0,
                  '&.AssetInput__select .MuiOutlinedInput-input': {
                    p: 0,
                    backgroundColor: 'transparent',
                    pr: '24px !important',
                  },
                  '&.AssetInput__select .MuiOutlinedInput-notchedOutline': { display: 'none' },
                  '&.AssetInput__select .MuiSelect-icon': {
                    color: 'text.primary',
                    right: '0%',
                  },
                }}
                renderValue={(symbol) => {
                  const asset =
                    assets.length === 1
                      ? assets[0]
                      : assets && (assets.find((asset) => asset.symbol === symbol) as T);
                  return (
                    <Box
                      sx={{ display: 'flex', alignItems: 'center' }}
                      data-cy={`assetsSelectedOption_${asset.symbol.toUpperCase()}`}
                    >
                      <TokenIcon
                        symbol={asset.iconSymbol || asset.symbol}
                        aToken={asset.aToken}
                        sx={{ mr: 2, ml: 4 }}
                      />
                      <Typography variant="main16" color="text.primary">
                        {symbol}
                      </Typography>
                    </Box>
                  );
                }}
              >
                {selectOptionHeader ? selectOptionHeader : undefined}
                {assets.map((asset) => (
                  <MenuItem
                    key={asset.symbol}
                    value={asset.symbol}
                    data-cy={`assetsSelectOption_${asset.symbol.toUpperCase()}`}
                  >
                    {selectOption ? (
                      selectOption(asset)
                    ) : (
                      <>
                        <TokenIcon
                          aToken={asset.aToken}
                          symbol={asset.iconSymbol || asset.symbol}
                          sx={{ fontSize: '22px', mr: 1 }}
                        />
                        <ListItemText sx={{ mr: 6 }}>{asset.symbol}</ListItemText>
                        {asset.balance && <FormattedNumber value={asset.balance} compact />}
                      </>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', height: '16px' }}>
          {loading ? (
            <Box sx={{ flex: 1 }} />
          ) : (
            <FormattedNumber
              value={isNaN(Number(usdValue)) ? 0 : Number(usdValue)}
              compact
              symbol="USD"
              variant="body7"
              color="text.mainTitle"
              symbolsColor="text.mainTitle"
              flexGrow={1}
            />
          )}

          {asset.balance && onChange && (
            <>
              <Typography component="div" variant="body7" color={theme.palette.text.mainTitle}>
                {balanceText && balanceText !== '' ? balanceText : <Trans>Balance</Trans>}{' '}
                <FormattedNumber
                  value={asset.balance}
                  visibleDecimals={2}
                  compact
                  variant="body7"
                  color="text.mainTitle"
                  symbolsColor="text.mainTitle"
                />
              </Typography>
              {!disableInput && (
                <Button
                  // size="small"
                  sx={(theme) => ({
                    ...theme.typography.body6,
                    display: 'block',
                    minWidth: 0,
                    p: 0,
                    ml: '2px',
                    textTransform: 'uppercase',
                    border: 'none',
                    ':hover': {
                      bgcolor: 'transparent',
                    },
                  })}
                  onClick={() => {
                    if (event) {
                      trackEvent(event.eventName, { ...event.eventParams });
                    }

                    onChange('-1');
                  }}
                  disabled={disabled || isMaxSelected}
                >
                  <Trans>Max</Trans>
                </Button>
              )}
            </>
          )}
        </Box>
        {exchangeRateComponent && (
          <Box
            sx={{
              background: theme.palette.background.surface,
              borderTop: `1px solid ${theme.palette.divider}`,
              px: 3,
              py: 2,
            }}
          >
            {exchangeRateComponent}
          </Box>
        )}
      </Box>
    </Box>
  );
};
