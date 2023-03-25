import { useRouter } from "next/router";
import {
  DestinyLoadoutComponent,
  DestinyLoadoutIconDefinition,
  DestinyLoadoutColorDefinition,
} from "bungie-api-ts/destiny2";
import { LoadoutSocket } from "@/core/components/destiny/LoadoutSocket";
import { TypographyLarge } from "@/core/components/typography";

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
  const router = useRouter();

  const { loadout: selectedLoadout } = router.query;

  return (
    <div className="flex flex-col space-y-2">
      <TypographyLarge>Select loadout</TypographyLarge>
      <div className="flex space-x-4">
        {loadouts.map((loadout, index) => {
          const searchParams = new URLSearchParams();
          searchParams.set("characterId", characterId);
          searchParams.set("loadout", index.toString());

          return (
            <LoadoutSocket
              key={index}
              href={`/me/new-loadout?${searchParams.toString()}`}
              iconImagePath={loadoutIcons[loadout.iconHash].iconImagePath}
              colorImagePath={loadoutColors[loadout.colorHash].colorImagePath}
              isSelected={selectedLoadout === index.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};
