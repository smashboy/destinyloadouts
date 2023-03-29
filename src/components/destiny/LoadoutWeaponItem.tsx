import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { ItemSocket, type ItemSocketProps } from "./ItemSocket";
import { LoadoutItemSocket } from "./LoadoutItemSocket";
import { ModSocket } from "./ModSocket";

interface LoadoutWeaponItemProps {
  item: LoadoutItem;
  socketProps: ItemSocketProps;
  inventoryItems: LoadoutInventoryItemsList;
}

const plugCategoryHashesExcludeList = [
  2947756142, // Kill tracker
  1716719962, // Empty Weapon Level Boost Socket
  3425085882, // Shaped Weapon
  3520412733, // Extract Pattern
  3185182717, // ???
];

export const LoadoutWeaponItem: React.FC<LoadoutWeaponItemProps> = ({
  item,
  socketProps,
  inventoryItems,
}) => {
  if (!item) return <ItemSocket {...socketProps} />;

  const [, plugItemHashes] = item;

  const sockets = plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter(
      (item) =>
        item &&
        !plugCategoryHashesExcludeList.includes(
          item.plug?.plugCategoryHash as number
        )
    );

  return (
    <div className="flex space-x-4">
      <LoadoutItemSocket item={item} inventoryItems={inventoryItems} />
      <div className="grid grid-cols-6 gap-4">
        {sockets.map((socket, index) => (
          <ModSocket key={index} socket={socket} />
        ))}
      </div>
    </div>
  );
};
