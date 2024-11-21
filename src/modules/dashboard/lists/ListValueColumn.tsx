import { Box, Tooltip, Typography } from '@mui/material';
import { ComponentProps, ReactNode } from 'react';

import { ListColumn, ListColumnProps } from '../../../components/lists/ListColumn';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';

interface ListValueColumnProps {
  symbol?: string;
  value: string | number;
  subValue?: string | number;
  withTooltip?: boolean;
  capsComponent?: ReactNode;
  disabled?: boolean;
  listColumnProps?: ListColumnProps;
  topColor?: string;
  topVariant?: ComponentProps<typeof Typography>['variant'];
  bottomColor?: string;
  bottomVariant?: ComponentProps<typeof Typography>['variant'];
}

const Content = ({
  value,
  withTooltip,
  subValue,
  disabled,
  capsComponent,
  topColor,
  topVariant,
  bottomColor,
  bottomVariant,
}: ListValueColumnProps) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FormattedNumber
          value={value}
          variant={topVariant || 'body6'}
          symbolsVariant={topVariant || 'body6'}
          color={disabled ? 'text.disabledText' : topColor || 'text.subTitle'}
          symbolsColor={disabled ? 'text.disabledText' : topColor || 'text.subTitle'}
          sx={{ mb: !withTooltip && !!subValue ? '2px' : 0 }}
          data-cy={`nativeAmount`}
        />
        {capsComponent}
      </Box>

      {!withTooltip && !!subValue && !disabled && (
        <FormattedNumber
          value={subValue}
          symbol="USD"
          variant={bottomVariant || 'body6'}
          symbolsVariant={bottomVariant || 'body6'}
          color={bottomColor || 'text.subTitle'}
          symbolsColor={bottomColor || 'text.subTitle'}
        />
      )}
    </>
  );
};

export const ListValueColumn = ({
  symbol,
  value,
  subValue,
  withTooltip,
  capsComponent,
  disabled,
  listColumnProps = {},
  topColor,
  topVariant,
  bottomColor,
  bottomVariant,
}: ListValueColumnProps) => {
  return (
    <ListColumn {...listColumnProps}>
      {withTooltip ? (
        <Tooltip
          title={
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FormattedNumber
                value={subValue || 0}
                symbol="USD"
                variant={topVariant || 'body6'}
                color={topColor || 'text.subTitle'}
                symbolsColor={topColor || 'text.subTitle'}
                symbolsVariant={topVariant || 'body6'}
                sx={{ mb: '2px' }}
                compact={false}
              />
              <FormattedNumber
                value={value}
                variant={bottomVariant || 'body6'}
                color={bottomColor || 'text.subTitle'}
                symbolsColor={bottomColor || 'text.subTitle'}
                symbolsVariant={bottomVariant || 'body6'}
                symbol={symbol}
                compact={false}
              />
            </Box>
          }
          arrow
          placement="top"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Content
              symbol={symbol}
              value={value}
              subValue={subValue}
              capsComponent={capsComponent}
              disabled={disabled}
              withTooltip={withTooltip}
            />
          </Box>
        </Tooltip>
      ) : (
        <Content
          symbol={symbol}
          value={value}
          subValue={subValue}
          capsComponent={capsComponent}
          disabled={disabled}
          withTooltip={withTooltip}
          topVariant={topVariant || 'body6'}
          topColor={topColor || 'text.primary'}
          bottomColor={bottomColor || 'text.mainTitle'}
          bottomVariant={bottomVariant || 'detail2'}
        />
      )}
    </ListColumn>
  );
};
