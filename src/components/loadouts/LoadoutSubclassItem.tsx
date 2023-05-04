import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
  type LoadoutPerkItemsList,
} from "~/bungie/types";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ModSocket } from "./ModSocket";
import { SubclassSocket } from "./SubclassSocket";
import { TypographyLarge } from "../typography";
import { LoadoutSectionContainer } from "../loadouts/LoadoutSectionContainer";
import { getInventoryItemPerks } from "~/utils/loadout";

interface LoadoutSubclassItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
  perkItems?: LoadoutPerkItemsList;
  hideSockets?: boolean;
  isSm?: boolean;
}

// const abilitySocketIdentifiers = [
//   "class_abilities",
//   "movement",
//   "melee",
//   "grenades",
// ];

export const LoadoutSubclassItem: React.FC<LoadoutSubclassItemProps> = ({
  item,
  inventoryItems,
  perkItems = {},
  hideSockets,
  isSm,
}) => {
  if (!item) return null;

  const [, plugItemHashes] = item;

  const sockets = plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter(Boolean) as DestinyInventoryItemDefinition[];

  const subclassSuper = sockets.filter((socket) =>
    socket.plug?.plugCategoryIdentifier.includes("supers")
  )[0] as DestinyInventoryItemDefinition;

  if (hideSockets) return <SubclassSocket super={subclassSuper} isSm={isSm} />;

  const aspects = sockets.filter(
    (socket) =>
      socket.plug?.plugCategoryIdentifier.includes("aspects") ||
      socket.plug?.plugCategoryIdentifier.includes("totems")
  );
  const fragments = sockets.filter(
    (socket) =>
      socket.plug?.plugCategoryIdentifier.includes("fragments") ||
      socket.plug?.plugCategoryIdentifier.includes("trinkets")
  );

  const abilities = sockets.filter(
    (socket) =>
      socket.plug?.plugCategoryIdentifier.includes("class_abilities") ||
      socket.plug?.plugCategoryIdentifier.includes("movement") ||
      socket.plug?.plugCategoryIdentifier.includes("melee") ||
      socket.plug?.plugCategoryIdentifier.includes("grenades")
  );

  const aspectPerks = getInventoryItemPerks(aspects, perkItems);
  const fragmentPerks = getInventoryItemPerks(fragments, perkItems);
  const abilityPerks = getInventoryItemPerks(abilities, perkItems);

  return (
    <div className="grid grid-cols-1 gap-4">
      <TypographyLarge>Subclass</TypographyLarge>
      <div className="grid w-full grid-cols-1 gap-4 2xl:w-fit 2xl:grid-cols-2">
        <div className="flex items-center justify-center">
          <SubclassSocket super={subclassSuper} isSm={isSm} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 md:mt-0">
          <div className="flex flex-col gap-4">
            <TypographyLarge>Abilities</TypographyLarge>
            <LoadoutSectionContainer className="grid w-fit grid-cols-2 gap-4">
              {abilities.map((ability, index) => (
                <ModSocket
                  key={index}
                  invenotryItem={ability}
                  perkItems={abilityPerks[index]}
                />
              ))}
            </LoadoutSectionContainer>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyLarge>Aspects</TypographyLarge>
            <LoadoutSectionContainer className="grid w-fit grid-cols-2 gap-4">
              {aspects.map((aspect, index) => (
                <ModSocket
                  key={index}
                  invenotryItem={aspect}
                  perkItems={aspectPerks[index]}
                />
              ))}
            </LoadoutSectionContainer>
          </div>
        </div>
      </div>
      <TypographyLarge>Fragments</TypographyLarge>
      <LoadoutSectionContainer className="flex flex-wrap gap-4">
        {fragments.map((fragment, index) => (
          <ModSocket
            key={index}
            invenotryItem={fragment}
            perkItems={fragmentPerks[index]}
          />
        ))}
      </LoadoutSectionContainer>
    </div>
  );
};
