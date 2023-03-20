import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemSocket } from "./LoadoutItemSocket";

interface LoadoutWeaponItemProps {
  item: LoadoutItem;
  socketProps: ItemSocketProps;
  inventoryItems: LoadoutInventoryItemsList;
}

export const LoadoutWeaponItem: React.FC<LoadoutWeaponItemProps> = ({
  item: loadoutItem,
  socketProps,
  inventoryItems,
}) => {
  if (!loadoutItem) return <ItemSocket {...socketProps} />;

  return (
    <div className="flex space-x-2">
      <LoadoutItemSocket item={loadoutItem} inventoryItems={inventoryItems} />
      <div className="flex space-x-2"></div>
    </div>
  );
};
