import Image from "next/image";
import { bungieNetOrigin } from "@/core/bungie-api/consants";
import {
  LoadoutInventoryItemsList,
  LoadoutItem,
} from "@/core/bungie-api/types";

interface LoadoutItemIconProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
}

export const LoadoutItemIcon: React.FC<LoadoutItemIconProps> = ({
  item,
  inventoryItems,
}) => {
  const itemHash = item?.item?.data?.itemHash;
  const overrideStyleItemHash = item?.item?.data?.overrideStyleItemHash;

  const inventoryItem = inventoryItems[itemHash!];
  const overrideInventoryItem = inventoryItems[overrideStyleItemHash!];

  if (!inventoryItem) return null;

  const {
    iconWatermark,
    displayProperties: { hasIcon, icon: initialIcon },
  } = inventoryItem;

  const icon = overrideInventoryItem?.displayProperties?.icon || initialIcon;

  return (
    <div className="relative rounded overflow-hidden w-full h-full">
      {hasIcon && (
        <Image
          src={`${bungieNetOrigin}/${icon}`}
          alt="Loadout item icon"
          fill
        />
      )}
      <Image
        src={`${bungieNetOrigin}/${iconWatermark}`}
        alt="Loadout item icon watermark"
        fill
      />
    </div>
  );
};
