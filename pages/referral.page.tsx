import { MainLayout } from 'src/layouts/MainLayout';
import { ReferralContent } from 'src/modules/referral/ReferralContent';
import { ReferralHeader } from 'src/modules/referral/ReferralHeader';
import { ContentContainer } from '../src/components/ContentContainer';

export default function Referral() {
  return (
    <>
      <ReferralHeader />
      <ContentContainer>
        <ReferralContent />
      </ContentContainer>
    </>
  );
}

Referral.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
