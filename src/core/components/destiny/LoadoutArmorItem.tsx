import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";
import {
  DestinyInventoryItemDefinition,
  DestinyItemSubType,
  DestinyItemType,
} from "bungie-api-ts/destiny2";
import { ConsoleLog } from "../ConsoleLog";
import { ArmorEnergy } from "./ArmorEnergy";
import { ItemSocket, ItemSocketProps } from "./ItemSocket";
import { LoadoutItemSocket } from "./LoadoutItemSocket";
import { ModSocket } from "./ModSocket";

interface LoadoutArmorItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
  socketProps: ItemSocketProps;
}

const getSockets = (
  hashes: number[],
  inventoryItems: LoadoutInventoryItemsList
) => {
  const sockets: DestinyInventoryItemDefinition[] = [];

  for (const hash of hashes) {
    const inventoryItem = inventoryItems[hash];

    if (
      inventoryItem &&
      (inventoryItem.itemType === DestinyItemType.Armor ||
        (inventoryItem.itemType === DestinyItemType.Mod &&
          inventoryItem.plug?.plugCategoryIdentifier !== "intrinsics" &&
          (inventoryItem.itemSubType === DestinyItemSubType.Ornament ||
            inventoryItem.itemSubType === DestinyItemSubType.None ||
            inventoryItem.itemSubType === DestinyItemSubType.Shader)))
    ) {
      sockets.push(inventoryItem);
    }
  }

  return sockets;
};

export const LoadoutArmorItem: React.FC<LoadoutArmorItemProps> = ({
  item,
  inventoryItems,
  socketProps,
}) => {
  if (!item) return <ItemSocket {...socketProps} />;

  const [loadoutItem] = item;

  const sockets = getSockets(loadoutItem.plugItemHashes, inventoryItems);

  const modsSockets = sockets.filter((socket) => socket.plug?.energyCost);
  const energyUsed = modsSockets.reduce(
    (acc, socket) => (acc += socket.plug?.energyCost?.energyCost || 0),
    0
  );

  return (
    <div className="flex space-x-4">
      <ConsoleLog modsSockets={modsSockets} />
      <LoadoutItemSocket item={item} inventoryItems={inventoryItems} />
      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap space-x-4">
          {sockets.map((socket, index) => (
            <ModSocket key={index} socket={socket} />
          ))}
        </div>
        <ArmorEnergy energyUsed={energyUsed} />
      </div>
    </div>
  );
};