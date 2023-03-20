import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemIcon } from "./LoadoutItemIcon";

interface LoadoutItemSocketProps extends ItemSocketProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
}

export const LoadoutItemSocket: React.FC<LoadoutItemSocketProps> = ({
  item,
  inventoryItems,
  ...props
}) => {
  const isMasterworked = item!.instance.data?.energy?.energyCapacity === 10;

  return (
    <ItemSocket isGoldBorder={isMasterworked} {...props}>
      <LoadoutItemIcon item={item} inventoryItems={inventoryItems} />
    </ItemSocket>
  );
};
