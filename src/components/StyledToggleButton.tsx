import { styled, ToggleButton, ToggleButtonProps } from '@mui/material';
import React from 'react';

interface CustomToggleButtonProps extends ToggleButtonProps {
  unselectedBackgroundColor?: string;
  maxWidth?: string;
}

const CustomToggleButton = styled(ToggleButton)<CustomToggleButtonProps>(
  ({ theme, unselectedBackgroundColor }) => ({
    border: '0px',
    flex: 1,
    backgroundColor: unselectedBackgroundColor || '#383D51',
    borderRadius: '4px',

    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#FFFFFF',
      borderRadius: '4px !important',
    },

    '&.Mui-selected, &.Mui-disabled': {
      zIndex: 100,
      height: '100%',
      display: 'flex',
      justifyContent: 'center',

      '.MuiTypography-subheader1': {
        background: theme.palette.gradients.aaveGradient,
        backgroundClip: 'text',
        textFillColor: 'transparent',
      },
      '.MuiTypography-secondary14': {
        background: theme.palette.gradients.aaveGradient,
        backgroundClip: 'text',
        textFillColor: 'transparent',
      },
    },
  })
) as typeof ToggleButton;

const CustomTxModalToggleButton = styled(ToggleButton)<ToggleButtonProps>(({ theme }) => ({
  flex: 1,
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.text.buttonBgTap,
  border: 0,
  '&:not(:disabled):hover': {
    backgroundColor: theme.palette.background.modulePopup,
  },
  '&.Mui-selected, &.Mui-selected:hover': {
    color: theme.palette.text.buttonBgTap,
    backgroundColor: theme.palette.text.secondary,
  },
  '&.Mui-disabled': {
    color: theme.palette.text.disabledText,
    backgroundColor: theme.palette.text.disabledBg,
  },
})) as typeof ToggleButton;

export function StyledTxModalToggleButton(props: CustomToggleButtonProps) {
  return <CustomTxModalToggleButton {...props} />;
}

export default function StyledToggleButton(props: ToggleButtonProps) {
  return <CustomToggleButton {...props} />;
}
