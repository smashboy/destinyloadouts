"use client";
import {
  DestinyLoadoutComponent,
  DestinyLoadoutIconDefinition,
  DestinyLoadoutColorDefinition,
} from "bungie-api-ts/destiny2";
import { LoadoutSocket } from "@/core/components/destiny/LoadoutSocket";
import { TypographyLarge } from "@/core/components/typography";
import { useSelectedLayoutSegment } from "next/navigation";

interface LoadoutSelectorProps {
  characterId: string;
  loadouts: DestinyLoadoutComponent[];
  loadoutIcons: Record<string, DestinyLoadoutIconDefinition>;
  loadoutColors: Record<string, DestinyLoadoutColorDefinition>;
}

export const LoadoutSelector: React.FC<LoadoutSelectorProps> = ({
  characterId,
  loadouts,
  loadoutIcons,
  loadoutColors,
}) => {
  const segment = useSelectedLayoutSegment();

  return (
    <div className="flex flex-col space-y-2">
      <TypographyLarge>Select loadout</TypographyLarge>
      <div className="flex space-x-4">
        {loadouts.map((loadout, index) => (
          <LoadoutSocket
            key={index}
            href={`/me/new-loadout/${characterId}/${index}`}
            iconImagePath={loadoutIcons[loadout.iconHash].iconImagePath}
            colorImagePath={loadoutColors[loadout.colorHash].colorImagePath}
            isSelected={`${index}` === segment}
          />
        ))}
      </div>
    </div>
  );
};
