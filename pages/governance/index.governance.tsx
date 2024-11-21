import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { MainLayout } from 'src/layouts/MainLayout';
import { GovernanceTopPanel } from 'src/modules/governance/GovernanceTopPanel';
import { ProposalsV3List } from 'src/modules/governance/ProposalsV3List';
import { UserGovernanceInfo } from 'src/modules/governance/UserGovernanceInfo';
import { useRootStore } from 'src/store/root';

import { ContentContainer } from '../../src/components/ContentContainer';

const GovDelegationModal = dynamic(() =>
  import('../../src/components/transactions/GovDelegation/GovDelegationModal').then(
    (module) => module.GovDelegationModal
  )
);

const GovRepresentativesModal = dynamic(() =>
  import('../../src/components/transactions/GovRepresentatives/GovRepresentativesModal').then(
    (module) => module.GovRepresentativesModal
  )
);

export default function Governance() {
  const trackEvent = useRootStore((store) => store.trackEvent);

  useEffect(() => {
    trackEvent('Page Viewed', {
      'Page Name': 'Governance',
    });
  }, [trackEvent]);
  return (
    <>
      <GovernanceTopPanel />
      <ContentContainer>
        <UserGovernanceInfo />
        <ProposalsV3List />
      </ContentContainer>
    </>
  );
}

Governance.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <MainLayout>
      {page}
      <GovDelegationModal />
      <GovRepresentativesModal />
    </MainLayout>
  );
};
