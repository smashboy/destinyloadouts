import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";
import { ConsoleLog } from "../ConsoleLog";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
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

  const [loadoutItem] = item;

  const sockets = loadoutItem.plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter((item) => item && item.plug?.plugCategoryHash !== 2947756142);

  return (
    <div className="flex space-x-4">
      <ConsoleLog sockets={sockets} />
      <LoadoutItemSocket item={item} inventoryItems={inventoryItems} />
      <div className="flex flex-wrap space-x-4">
        {sockets.map((socket, index) => (
          <ModSocket key={index} socket={socket} />
        ))}
      </div>
    </div>
  );
};
