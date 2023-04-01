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
  isSm?: boolean;
  hideSockets?: boolean;
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
  isSm,
  hideSockets,
}) => {
  if (!item) return <ItemSocket {...socketProps} isSm={isSm} />;

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

  if (sockets.length === 0 || hideSockets)
    return (
      <LoadoutItemSocket
        item={item}
        inventoryItems={inventoryItems}
        isSm={isSm}
      />
    );

  return (
    <div className="flex space-x-4">
      <LoadoutItemSocket
        item={item}
        inventoryItems={inventoryItems}
        isSm={isSm}
      />
      <div className="grid grid-cols-6 gap-4">
        {sockets.map((socket, index) => (
          <ModSocket key={index} socket={socket} />
        ))}
      </div>
    </div>
  );
};
