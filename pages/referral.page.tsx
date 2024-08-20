import { Container } from '@mui/material';
import { ReactNode } from 'react';
import { MainLayout } from 'src/layouts/MainLayout';
import { ReferralContent } from 'src/modules/referral/ReferralContent';
import { ReferralHeader } from 'src/modules/referral/ReferralHeader';

export default function Referral() {
  return (
    <>
      <ReferralHeader />
      <ReferralContent />
      {/* <MarketContainer>
            <MarketAssetsListContainer />
          </MarketContainer> */}
    </>
  );
}
interface ReferralContainerProps {
  children: ReactNode;
}

// export const ReferralContainerProps = {
//   sx: {
//     p: '0 !important',
//     mt: '40px',
//     mb: '189px',
//   },
// };

// export const ReferralContainer = ({ children }: ReferralContainerProps) => {
//   return <Container {...ReferralContainerProps}>{children}</Container>;
// };
Referral.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      {/** Modals */}
      {/** End of modals */}
    </MainLayout>
  );
};
