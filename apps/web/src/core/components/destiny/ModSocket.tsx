import Image from "next/image";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ItemSocket } from "./ItemSocket";
import { bungieNetOrigin } from "@destiny/shared/constants";
import { getDestinyItemActiveWatermarkIcon } from "~/core/bungie-api/utils";

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
        {watermarkIcon && (
          <Image
            src={`${bungieNetOrigin}/${watermarkIcon}`}
            alt="Loadout item icon"
            fill
          />
        )}
      </div>
    </ItemSocket>
  );
};
