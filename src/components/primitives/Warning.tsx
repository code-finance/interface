import { Alert, AlertProps } from '@mui/material';

export const Warning = ({ children, sx, ...rest }: AlertProps) => {
  const styles = { mb: 6, alignItems: 'center', width: '100%' };

  return (
    <Alert sx={[styles, ...(Array.isArray(sx) ? sx : [sx])]} {...rest}>
      {children}
    </Alert>
  );
};
