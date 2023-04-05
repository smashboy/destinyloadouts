import Image from "next/image";
import {
  DestinyItemSubType,
  DestinyItemType,
  type DestinyInventoryItemDefinition,
} from "bungie-api-ts/destiny2";
import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { getDestinyItemActiveWatermarkIcon } from "~/bungie/getDestinyItemActiveWatermarkIcon";
import { bungieNetOrigin } from "~/bungie/constants";

interface LoadoutItemIconProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
}

const getStyleItem = (
  hashes: number[],
  inventoryItems: LoadoutInventoryItemsList
) => {
  let styleItem: DestinyInventoryItemDefinition | null = null;

  for (const hash of hashes) {
    const inventoryItem = inventoryItems[hash];

    if (
      inventoryItem &&
      ((inventoryItem.itemType === DestinyItemType.Mod &&
        inventoryItem.itemSubType === DestinyItemSubType.Ornament &&
        inventoryItem.plug?.plugCategoryIdentifier !== "armor_skins_empty" &&
        inventoryItem.plug?.plugCategoryIdentifier !== "exotic_all_skins") ||
        inventoryItem.itemType === DestinyItemType.Armor)
    ) {
      styleItem = inventoryItem;
      break;
    }
  }

  return styleItem;
};

export const LoadoutItemIcon: React.FC<LoadoutItemIconProps> = ({
  item,
  inventoryItems,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [itemHash, plugItemHashes] = item!;
  const overrideStyleItem = getStyleItem(plugItemHashes, inventoryItems);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const inventoryItem = inventoryItems[itemHash!];

  if (!inventoryItem) return null;

  const {
    displayProperties: { hasIcon, icon: initialIcon },
  } = inventoryItem;

  const icon = overrideStyleItem?.displayProperties?.icon || initialIcon;

  const watermarkIcon = getDestinyItemActiveWatermarkIcon(inventoryItem);

  return (
    <div className="relative h-full w-full overflow-hidden rounded">
      {hasIcon && (
        <Image
          src={`${bungieNetOrigin}/${icon}`}
          alt="Loadout item icon"
          fill
        />
      )}
      {watermarkIcon && (
        <Image
          src={`${bungieNetOrigin}/${watermarkIcon}`}
          alt="Loadout item icon watermark"
          id="gavno"
          fill
        />
      )}
    </div>
  );
};
