import { styled, ToggleButton, ToggleButtonProps } from '@mui/material';
import React from 'react';

interface CustomToggleButtonProps extends ToggleButtonProps {
  unselectedBackgroundColor?: string;
  maxWidth?: string;
}

const CustomToggleButton = styled(ToggleButton)<CustomToggleButtonProps>(({ theme }) => ({
  flex: 1,
  color: '#111213',
  backgroundColor: '#FBFBFB',
  border: 0,
  padding: '10px',
  textTransform: 'none',
  ...theme.typography.body7,
  transition: '0.3s',
  '&:not(:disabled):hover': {
    opacity: 0.8,
  },
  '&:not(.Mui-selected):hover': {
    color: '#111213',
    backgroundColor: '#FBFBFB',
  },
  '&.Mui-selected, &.Mui-selected:hover': {
    color: '#F5F5F5',
    backgroundColor: '#454854',
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
    border: 'none',
  },
})) as typeof ToggleButton;

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

export function StyledTxModalToggleButton({ sx, ...props }: CustomToggleButtonProps) {
  return (
    <CustomTxModalToggleButton
      {...props}
      sx={[{ minWidth: { xsm: '198px' } }, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}

export default function StyledToggleButton({ sx, ...props }: ToggleButtonProps) {
  return (
    <CustomToggleButton
      {...props}
      sx={[{ minWidth: { xsm: '198px' } }, ...(Array.isArray(sx) ? sx : [sx])]}
    />
  );
}
