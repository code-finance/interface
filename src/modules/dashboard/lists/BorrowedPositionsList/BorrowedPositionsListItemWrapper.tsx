import { AssetCapsProvider } from 'src/hooks/useAssetCaps';
import { useProtocolDataContext } from 'src/hooks/useProtocolDataContext';
import { DashboardReserve } from 'src/utils/dashboardSortUtils';
import { displayGhoForMintableMarket } from 'src/utils/ghoUtilities';

import { BorrowedPositionsListItem } from './BorrowedPositionsListItem';
import { GhoBorrowedPositionsListItem } from './GhoBorrowedPositionsListItem';

export const BorrowedPositionsListItemWrapper = ({ item }: { item: DashboardReserve }) => {
  return (
    <AssetCapsProvider asset={item.reserve}>
      <BorrowedPositionsListItem item={item} />
    </AssetCapsProvider>
  );
};
