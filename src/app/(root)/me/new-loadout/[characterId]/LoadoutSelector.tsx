"use client";
import {
  DestinyCharacterLoadout,
  DestinyContentLoadoutColorList,
  DestinyContentLoadoutIconList,
} from "@/core/bungie-api/types";
import { LoadoutSocket } from "@/core/components/destiny/LoadoutSocket";
import { TypographyLarge } from "@/core/components/typography";
import { useSelectedLayoutSegment } from "next/navigation";

interface LoadoutSelectorProps {
  characterId: string;
  loadouts: DestinyCharacterLoadout[];
  loadoutIcons: DestinyContentLoadoutIconList;
  loadoutColors: DestinyContentLoadoutColorList;
}

export const LoadoutSelector: React.FC<LoadoutSelectorProps> = ({
  characterId,
  loadouts,
  loadoutIcons,
  loadoutColors,
}) => {
  const segment = useSelectedLayoutSegment();

  console.log(segment);

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
