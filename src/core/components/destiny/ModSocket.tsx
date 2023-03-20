import Image from "next/image";
import {
  DestinyItemSocketState,
  DestinyItemSubType,
  DestinyItemType,
  PlugAvailabilityMode,
} from "bungie-api-ts/destiny2";
import { ItemSocket } from "./ItemSocket";
import { bungieNetOrigin } from "@/core/bungie-api/consants";
import { LoadoutInventoryItemsList } from "@/core/bungie-api/types";

interface ModSocketProps {
  // modTypeIcon: string; local icon path
  socket: DestinyItemSocketState;
  inventoryItems: LoadoutInventoryItemsList;
}

const modSubTypes = [
  DestinyItemSubType.Shader,
  DestinyItemSubType.Ornament,
  DestinyItemSubType.None,
];

export const ModSocket: React.FC<ModSocketProps> = ({
  socket,
  inventoryItems,
}) => {
  const { plugHash } = socket;

  const inventoryItem = inventoryItems[plugHash!];

  if (!inventoryItem) return null;

  const {
    displayProperties: { icon: iconPath },
    itemType,
    itemSubType,
    plug,
  } = inventoryItem;

  if (
    itemType === DestinyItemType.Mod &&
    modSubTypes.includes(itemSubType) &&
    plug?.plugCategoryIdentifier !== "intrinsics" &&
    plug?.plugAvailability !==
      PlugAvailabilityMode.AvailableIfSocketContainsMatchingPlugCategory
  )
    return (
      <ItemSocket>
        <div className="relative rounded overflow-hidden w-full h-full flex items-center justify-center bg-slate-400">
          {/* <Image
            src="/destiny-icons/modFrame.svg"
            fill
            alt="Mod socket frame"
          />
          <Image
            src={modTypeIcon}
            width={32}
            height={32}
            alt="Mod socket icon"
            className="opacity-30"
          /> */}
          {iconPath && (
            <Image src={`${bungieNetOrigin}/${iconPath}`} alt="Mod icon" fill />
          )}
        </div>
      </ItemSocket>
    );

  return null;
};
