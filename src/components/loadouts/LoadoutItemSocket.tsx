import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { ItemSocket, type ItemSocketProps } from "./ItemSocket";
import { LoadoutItemIcon } from "./LoadoutItemIcon";
import { HoverCard, HoverCardTrigger, ItemHoverCard } from "./ItemHoverCard";

interface LoadoutItemSocketProps extends ItemSocketProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
}

export const LoadoutItemSocket: React.FC<LoadoutItemSocketProps> = ({
  item,
  inventoryItems,
  ...props
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [itemHash] = item!;
  // const isMasterworked =
  //   itemInstance.instance.data?.energy?.energyCapacity === 10;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inventoryItem = inventoryItems[itemHash]!;

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <ItemSocket {...props}>
          <LoadoutItemIcon item={item} inventoryItems={inventoryItems} />
        </ItemSocket>
      </HoverCardTrigger>
      <ItemHoverCard item={inventoryItem} />
    </HoverCard>
  );
};
