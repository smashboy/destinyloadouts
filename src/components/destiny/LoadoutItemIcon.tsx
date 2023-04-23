import Image from "next/image";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { getDestinyItemActiveWatermarkIcon } from "~/bungie/getDestinyItemActiveWatermarkIcon";
import { bungieNetOrigin } from "~/bungie/constants";
import { DestinyItemSubType, DestinyItemType } from "~/bungie/__generated";
import { ammunitionIconMap } from "~/constants/loadouts";

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

  const ammoTypeIcon = inventoryItem.equippingBlock?.ammoType
    ? ammunitionIconMap[inventoryItem.equippingBlock.ammoType]
    : null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded">
      {hasIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${bungieNetOrigin}/${icon}`}
          alt="Loadout item icon"
          className="absolute inset-0"
        />
      )}
      {watermarkIcon && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${bungieNetOrigin}/${watermarkIcon}`}
          alt="Loadout item icon watermark"
          className="absolute inset-0"
        />
      )}
      {ammoTypeIcon && (
        <Image
          src={ammoTypeIcon}
          width={14}
          height={14}
          alt="Ammo type icon"
          className="absolute bottom-0.5 right-0.5"
        />
      )}
    </div>
  );
};
