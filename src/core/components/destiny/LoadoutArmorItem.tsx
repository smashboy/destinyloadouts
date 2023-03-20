import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";
import { DestinyItemSubType, DestinyItemType } from "bungie-api-ts/destiny2";
import { ConsoleLog } from "../ConsoleLog";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemSocket } from "./LoadoutItemSocket";
import { ModSocket } from "./ModSocket";

interface LoadoutArmorItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
  socketProps: ItemSocketProps;
}

export const LoadoutArmorItem: React.FC<LoadoutArmorItemProps> = ({
  item,
  inventoryItems,
  socketProps,
}) => {
  if (!item) return <ItemSocket {...socketProps} />;

  const sockets =
    item.sockets?.data?.sockets?.filter(
      ({ isEnabled, isVisible, plugHash }) => isEnabled && isVisible && plugHash
    ) || [];

  return (
    <div className="flex space-x-4">
      <ConsoleLog
        allSockets={item.sockets?.data?.sockets || []}
        ornamentSockets={(item.sockets?.data?.sockets || [])
          .map((socket) => [inventoryItems[socket.plugHash!], socket])
          .filter(([socket]) => !!socket)}
      />
      <LoadoutItemSocket item={item} inventoryItems={inventoryItems} />
      <div className="flex flex-wrap space-x-4">
        {sockets.map((socket, index) => (
          <ModSocket
            key={index}
            socket={socket}
            inventoryItems={inventoryItems}
          />
        ))}
      </div>
    </div>
  );
};
