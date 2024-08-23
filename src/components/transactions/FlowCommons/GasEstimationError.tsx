import { Trans } from '@lingui/macro';
import { Button, Typography } from '@mui/material';
import { Warning } from 'src/components/primitives/Warning';
import { TxErrorType } from 'src/ui-config/errorMapping';

export const GasEstimationError = ({ txError }: { txError: TxErrorType }) => {
  return (
    <Warning severity="warning" sx={{ mt: 4, mb: 0 }}>
      {txError.error ? (
        <>
          {txError.error}{' '}
          <span
            style={{ verticalAlign: 'top', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(txError.rawError.message.toString())}
          >
            <Trans>copy the error</Trans>
          </span>
        </>
      ) : (
        <Trans>
          There was some error. Please try changing the parameters or{' '}
          <span
            style={{ verticalAlign: 'top', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(txError.rawError.message.toString())}
          >
            <Trans>copy the error</Trans>
          </span>
        </Trans>
      )}
    </Warning>
  );
};
