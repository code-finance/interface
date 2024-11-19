import { Trans } from '@lingui/macro';
import { AlertColor, Typography } from '@mui/material';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/mixPanelEvents';

import { HealthFactorNumber } from '../../../components/HealthFactorNumber';
import { BasicModal } from '../../../components/primitives/BasicModal';
import { FormattedNumber } from '../../../components/primitives/FormattedNumber';
import { Link } from '../../../components/primitives/Link';
import { HFContent } from './components/HFContent';
import { InfoWrapper } from './components/InfoWrapper';
import { LTVContent } from './components/LTVContent';

interface LiquidationRiskParametresInfoModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  healthFactor: string;
  loanToValue: string;
  currentLoanToValue: string;
  currentLiquidationThreshold: string;
}

export const LiquidationRiskParametresInfoModal = ({
  open,
  setOpen,
  healthFactor,
  loanToValue,
  currentLoanToValue,
  currentLiquidationThreshold,
}: LiquidationRiskParametresInfoModalProps) => {
  let healthFactorColor: AlertColor = 'success';
  let healthFactorText = 'Low Risk';
  const hf = Number(healthFactor);
  if (hf > 1.1 && hf <= 3) {
    healthFactorColor = 'warning';
    healthFactorText = 'Medium Risk';
  } else if (hf <= 1.1) {
    healthFactorColor = 'error';
    healthFactorText = 'High Risk';
  }
  const trackEvent = useRootStore((store) => store.trackEvent);

  let ltvColor: AlertColor = 'success';
  let ltvText = 'Low Risk';
  const ltvPercent = Number(loanToValue) * 100;
  const currentLtvPercent = Number(currentLoanToValue) * 100;
  const liquidationThresholdPercent = Number(currentLiquidationThreshold) * 100;
  if (ltvPercent >= Math.min(currentLtvPercent, liquidationThresholdPercent)) {
    ltvColor = 'error';
    ltvText = 'High Risk';
  } else if (ltvPercent > currentLtvPercent / 2 && ltvPercent < currentLtvPercent) {
    ltvColor = 'warning';
    ltvText = 'Medium Risk';
  }

  return (
    <BasicModal open={open} setOpen={setOpen}>
      <Typography variant="h5" mb={3}>
        <Trans>Liquidation risk parameters</Trans>
      </Typography>
      <Typography mb={8} variant="detail5" color="text.secondary" component="div">
        <Trans>
          Your health factor and loan to value determine the assurance of your collateral. To avoid
          liquidations you can supply more collateral or repay borrow positions.
        </Trans>{' '}
        <Link
          onClick={() => {
            trackEvent(GENERAL.EXTERNAL_LINK, {
              Link: 'HF Risk Link',
            });
          }}
          href="https://docs.aave.com/faq/"
          sx={{ textDecoration: 'underline', color: 'inherit' }}
        >
          <Trans>Learn more</Trans>
        </Link>
      </Typography>

      <InfoWrapper
        topTitle={<Trans>Health factor</Trans>}
        topDescription={
          <Trans>
            Safety of your deposited collateral against the borrowed assets and its underlying
            value.
          </Trans>
        }
        topValue={
          <Typography
            variant="detail2"
            color="text.buttonText"
            textTransform={'uppercase'}
            whiteSpace={'nowrap'}
          >
            {healthFactorText}
          </Typography>
        }
        bottomText={
          <Trans>
            If the health factor goes below 1, the liquidation of your collateral might be
            triggered.
          </Trans>
        }
        color={healthFactorColor}
      >
        <HFContent healthFactor={healthFactor} />
      </InfoWrapper>

      <InfoWrapper
        topTitle={<Trans>Current LTV</Trans>}
        topDescription={
          <Trans>Your current loan to value based on your collateral supplied.</Trans>
        }
        topValue={
          <Typography
            variant="detail2"
            color="text.buttonText"
            textTransform={'uppercase'}
            whiteSpace={'nowrap'}
          >
            {ltvText}
          </Typography>
        }
        bottomText={
          <Trans>
            If your loan to value goes above the liquidation threshold your collateral supplied may
            be liquidated.
          </Trans>
        }
        color={ltvColor}
      >
        <LTVContent
          loanToValue={loanToValue}
          currentLoanToValue={currentLoanToValue}
          currentLiquidationThreshold={currentLiquidationThreshold}
          color={ltvColor}
        />
      </InfoWrapper>
    </BasicModal>
  );
};
