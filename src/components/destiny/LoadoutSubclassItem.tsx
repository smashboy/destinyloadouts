import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { ModSocket } from "./ModSocket";
import { SubclassSocket } from "./SubclassSocket";
import { TypographyLarge } from "../typography";
import { LoadoutSectionContainer } from "../loadouts/LoadoutSectionContainer";

interface LoadoutSubclassItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
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
  hideSockets,
  isSm,
}) => {
  if (!item) return null;

  const [, plugItemHashes] = item;

  const sockets = plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter(Boolean) as DestinyInventoryItemDefinition[];

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

  const subclassSuper = sockets.filter((socket) =>
    socket.plug?.plugCategoryIdentifier.includes("supers")
  )[0] as DestinyInventoryItemDefinition;

  if (hideSockets) return <SubclassSocket super={subclassSuper} isSm={isSm} />;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid w-fit grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          <SubclassSocket super={subclassSuper} isSm={isSm} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <TypographyLarge>Abilities</TypographyLarge>
            <LoadoutSectionContainer className="grid w-fit grid-cols-2 gap-4">
              {abilities.map((ability, index) => (
                <ModSocket key={index} socket={ability} />
              ))}
            </LoadoutSectionContainer>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyLarge>Aspects</TypographyLarge>
            <LoadoutSectionContainer className="grid w-fit grid-cols-2 gap-4">
              {aspects.map((aspect, index) => (
                <ModSocket key={index} socket={aspect} />
              ))}
            </LoadoutSectionContainer>
          </div>
        </div>
      </div>
      <TypographyLarge>Fragments</TypographyLarge>
      <LoadoutSectionContainer className="flex space-x-4">
        {fragments.map((fragment, index) => (
          <ModSocket key={index} socket={fragment} />
        ))}
      </LoadoutSectionContainer>
    </div>
  );
};
