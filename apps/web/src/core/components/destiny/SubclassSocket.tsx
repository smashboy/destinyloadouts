import Image from "next/image";

import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { bungieNetOrigin } from "@/core/bungie-api/consants";

interface SubclassSocketProps {
  super: DestinyInventoryItemDefinition;
}

export const SubclassSocket: React.FC<SubclassSocketProps> = ({
  super: subclassSuper,
}) => {
  return (
    <button className="w-32 h-32 rotate-45 rounded relative transition ease-out duration-300 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-4 hover:ring-2 hover:ring-slate-300 hover:ring-offset-4">
      <span className="ring-2 relative rounded w-full h-full ring-slate-300 flex items-center overflow-hidden justify-center">
        <Image
          src={`${bungieNetOrigin}/${subclassSuper.displayProperties.icon}`}
          alt="Subclass super icon"
          className="-rotate-45"
          fill
        />
      </span>
    </button>
  );
};
