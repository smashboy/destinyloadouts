import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { ArmorEnergy } from "./ArmorEnergy";
import { ItemSocket, type ItemSocketProps } from "./ItemSocket";
import { LoadoutItemSocket } from "./LoadoutItemSocket";
import { ModSocket } from "./ModSocket";
import { DestinyItemSubType, DestinyItemType } from "~/bungie/__generated";

interface LoadoutArmorItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
  socketProps: ItemSocketProps;
  isSm?: boolean;
  hideSockets?: boolean;
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
          inventoryItem.plug?.plugCategoryHash !== 1744546145 &&
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
  isSm,
  hideSockets,
}) => {
  if (!item) return <ItemSocket {...socketProps} isSm={isSm} />;

  const [, plugItemHashes] = item;

  const sockets = getSockets(plugItemHashes, inventoryItems);

  const modsSockets = sockets.filter((socket) => socket.plug?.energyCost);
  const energyUsed = modsSockets.reduce(
    (acc, socket) => (acc += socket.plug?.energyCost?.energyCost || 0),
    0
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
    <div className="flex h-full flex-col justify-between space-y-4">
      <div className="flex space-x-4">
        <LoadoutItemSocket
          item={item}
          inventoryItems={inventoryItems}
          isSm={isSm}
        />
        <div className="flex flex-wrap gap-4">
          {sockets.map((socket, index) => (
            <ModSocket key={index} socket={socket} />
          ))}
        </div>
      </div>
      <ArmorEnergy energyUsed={energyUsed} />
    </div>
  );
};
