import Image from "next/image";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { bungieNetOrigin } from "@/core/bungie-api/consants";

interface LoadoutItemIconProps {
  inventoryItem: DestinyInventoryItemDefinition;
}

export const LoadoutItemIcon: React.FC<LoadoutItemIconProps> = ({
  inventoryItem: {
    iconWatermark,
    displayProperties: { hasIcon, icon },
  },
}) => (
  <div className="relative rounded overflow-hidden w-full h-full">
    <Image
      src={`${bungieNetOrigin}/${iconWatermark}`}
      alt="Loadout item icon watermark"
      className="z-10"
      fill
    />
    {hasIcon && (
      <Image src={`${bungieNetOrigin}/${icon}`} alt="Loadout item icon" fill />
    )}
  </div>
);
