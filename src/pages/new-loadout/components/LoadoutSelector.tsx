import { useRouter } from "next/router";
import {
  type DestinyLoadoutComponent,
  type DestinyLoadoutIconDefinition,
  type DestinyLoadoutColorDefinition,
} from "bungie-api-ts/destiny2";
import { LoadoutSocket } from "~/components/destiny/LoadoutSocket";
import { TypographyLarge } from "~/components/typography";

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
              href={`/new-loadout?${searchParams.toString()}`}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              iconImagePath={loadoutIcons[loadout.iconHash]!.iconImagePath}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              colorImagePath={loadoutColors[loadout.colorHash]!.colorImagePath}
              isSelected={selectedLoadout === index.toString()}
            />
          );
        })}
      </div>
    </div>
  );
};
