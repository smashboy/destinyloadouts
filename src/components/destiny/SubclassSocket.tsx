import Image from "next/image";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { bungieNetOrigin } from "~/bungie/constants";
import { HoverCard, HoverCardTrigger, ItemHoverCard } from "./ItemHoverCard";

interface SubclassSocketProps {
  super: DestinyInventoryItemDefinition;
}

export const SubclassSocket: React.FC<SubclassSocketProps> = ({
  super: subclassSuper,
}) => (
  <HoverCard openDelay={100} closeDelay={100}>
    <HoverCardTrigger>
      <button className="relative h-32 w-32 rotate-45 rounded transition duration-300 ease-out hover:ring-2 hover:ring-slate-300 hover:ring-offset-4 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-4">
        <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded ring-2 ring-slate-300">
          <Image
            src={`${bungieNetOrigin}/${subclassSuper.displayProperties.icon}`}
            alt="Subclass super icon"
            className="-rotate-45"
            fill
          />
        </span>
      </button>
    </HoverCardTrigger>
    <ItemHoverCard item={subclassSuper} />
  </HoverCard>
);