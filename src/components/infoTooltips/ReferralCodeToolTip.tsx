import { Trans } from '@lingui/macro';

import { TextWithTooltip, TextWithTooltipProps } from '../TextWithTooltip';
import { FC } from 'react';

interface Props extends TextWithTooltipProps {
  code: string;
}

export const ReferralCodeToolTip: FC<Props> = ({ code, ...rest }) => {
  return (
    <TextWithTooltip {...rest}>
      <Trans>{code}</Trans>
    </TextWithTooltip>
  );
};
