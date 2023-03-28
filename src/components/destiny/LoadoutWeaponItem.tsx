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

export const LoadoutWeaponItem: React.FC<LoadoutWeaponItemProps> = ({
  item,
  socketProps,
  inventoryItems,
}) => {
  if (!item) return <ItemSocket {...socketProps} />;

  const [, plugItemHashes] = item;

  const sockets = plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter((item) => item && item.plug?.plugCategoryHash !== 2947756142);

  return (
    <div className="flex space-x-4">
      {/* <ConsoleLog sockets={sockets} /> */}
      <LoadoutItemSocket item={item} inventoryItems={inventoryItems} />
      <div className="grid grid-cols-6 gap-4">
        {sockets.map((socket, index) => (
          <ModSocket key={index} socket={socket} />
        ))}
      </div>
    </div>
  );
};
