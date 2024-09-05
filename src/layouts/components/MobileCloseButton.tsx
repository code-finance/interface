import { XIcon } from '@heroicons/react/outline';
import { Button, IconButton, SvgIcon } from '@mui/material';
import React from 'react';

interface MobileCloseButtonProps {
  setOpen: (value: boolean) => void;
}

export const MobileCloseButton = ({ setOpen }: MobileCloseButtonProps) => {
  return (
    <Button
      onClick={() => setOpen(false)}
      sx={{
        p: 2,
        minWidth: 'unset',
        width: '40px',
        height: '40px',
        border: 'none',
        background: 'transparent',
      }}
    >
      <SvgIcon sx={{ color: 'text.secondary' }} fontSize="small">
        <XIcon />
      </SvgIcon>
    </Button>
  );
};
