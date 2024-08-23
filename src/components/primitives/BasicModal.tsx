import { XIcon } from '@heroicons/react/outline';
import { Box, IconButton, Modal, Paper, SvgIcon } from '@mui/material';
import React from 'react';

export interface BasicModalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: (value: boolean) => void;
  withCloseButton?: boolean;
  contentMaxWidth?: number;
}

export const BasicModal = ({
  open,
  setOpen,
  withCloseButton = true,
  contentMaxWidth = 420,
  children,
  ...props
}: BasicModalProps) => {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '& > .MuiPaper-root': {
          outline: 'none',
          borderRadius: 0,
          background: theme.palette.background.primary,
          boxShadow: '0px 8px 16px -2px rgba(27, 33, 44, 0.12)',
        },
      })}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
      data-cy={'Modal'}
    >
      <Paper
        sx={{
          position: 'relative',
          margin: 2,
          overflowY: 'auto',
          width: '100%',
          maxWidth: { xs: 630, md: contentMaxWidth },
          maxHeight: 'calc(100vh - 20px)',
          px: 5,
          py: 8.5,
        }}
      >
        {children}

        {withCloseButton && (
          <Box sx={{ position: 'absolute', top: '34px', right: '18px' }}>
            <SvgIcon
              sx={{ fontSize: '24px', color: 'text.primary', cursor: 'pointer' }}
              onClick={handleClose}
              data-cy={'close-button'}
            >
              <XIcon data-cy={'CloseModalIcon'} />
            </SvgIcon>
          </Box>
        )}
      </Paper>
    </Modal>
  );
};
