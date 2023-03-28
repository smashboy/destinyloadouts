import Image from "next/image";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ItemSocket } from "./ItemSocket";
import { getDestinyItemActiveWatermarkIcon } from "~/bungie/getDestinyItemActiveWatermarkIcon";
import { bungieNetOrigin } from "~/bungie/constants";
import { HoverCard, HoverCardTrigger, ItemHoverCard } from "./ItemHoverCard";

interface ModSocketProps {
  // modTypeIcon: string; local icon path
  socket: DestinyInventoryItemDefinition;
}

export const ModSocket: React.FC<ModSocketProps> = ({ socket }) => {
  const {
    displayProperties: { icon: iconPath },
  } = socket;

  const watermarkIcon = getDestinyItemActiveWatermarkIcon(socket);

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger>
        <ItemSocket>
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded bg-slate-400">
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
              <Image
                src={`${bungieNetOrigin}/${iconPath}`}
                alt="Mod icon"
                fill
              />
            )}
            {watermarkIcon && (
              <Image
                src={`${bungieNetOrigin}/${watermarkIcon}`}
                alt="Loadout item icon"
                fill
              />
            )}
          </div>
        </ItemSocket>
      </HoverCardTrigger>
      <ItemHoverCard item={socket} />
    </HoverCard>
  );
};
