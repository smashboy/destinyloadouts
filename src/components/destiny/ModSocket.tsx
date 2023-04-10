import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ItemSocket } from "./ItemSocket";
import { getDestinyItemActiveWatermarkIcon } from "~/bungie/getDestinyItemActiveWatermarkIcon";
import { bungieNetOrigin } from "~/bungie/constants";
import { HoverCard, HoverCardTrigger, ItemHoverCard } from "./ItemHoverCard";
import { TypographySubtle } from "../typography";

interface ModSocketProps {
  // modTypeIcon: string; local icon path
  socket: DestinyInventoryItemDefinition;
}

export const ModSocket: React.FC<ModSocketProps> = ({ socket }) => {
  const {
    displayProperties: { icon: iconPath },
    plug,
  } = socket;

  const watermarkIcon = getDestinyItemActiveWatermarkIcon(socket);

  const enegryCost =
    !plug?.plugCategoryIdentifier.includes("fragments") &&
    plug?.energyCost?.energyCost;

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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${bungieNetOrigin}/${iconPath}`}
                alt="Mod icon"
                className="absolute inset-0"
              />
            )}
            {watermarkIcon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${bungieNetOrigin}/${watermarkIcon}`}
                alt="Loadout item icon"
                className="absolute inset-0"
              />
            )}
            {enegryCost !== undefined && (
              <TypographySubtle className="absolute top-0.5 right-2 z-10 text-white">
                {enegryCost}
              </TypographySubtle>
            )}
          </div>
        </ItemSocket>
      </HoverCardTrigger>
      <ItemHoverCard item={socket} />
    </HoverCard>
  );
};
