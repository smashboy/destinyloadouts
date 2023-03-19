import Image from "next/image";
import { bungieNetOrigin } from "@/core/bungie-api/consants";
import { LoadoutItem } from "@/core/bungie-api/types";

interface LoadoutItemIconProps {
  item: LoadoutItem;
}

export const LoadoutItemIcon: React.FC<LoadoutItemIconProps> = ({
  item: loadoutItem,
}) => {
  const { inventoryItem, overrideStyleInventoryItem } = loadoutItem!;

  if (!inventoryItem) return null;

  const {
    iconWatermark,
    displayProperties: { icon, hasIcon },
  } = inventoryItem;

  const itemIcon = overrideStyleInventoryItem?.displayProperties?.icon || icon;

  return (
    <div className="relative rounded overflow-hidden w-full h-full">
      {hasIcon && (
        <Image
          src={`${bungieNetOrigin}/${itemIcon}`}
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
