import {
  type LoadoutInventoryItemsList,
  type LoadoutItem,
} from "~/bungie/types";
import { ModSocket } from "./ModSocket";
import { SubclassSocket } from "./SubclassSocket";
import { TypographyLarge } from "../typography";

interface LoadoutSubclassItemProps {
  item: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
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
}) => {
  if (!item) return null;

  const [, plugItemHashes] = item;

  const sockets = plugItemHashes
    .map((hash) => inventoryItems[hash])
    .filter(Boolean);

  const aspects = sockets.filter((socket) =>
    socket.plug?.plugCategoryIdentifier.includes("aspects")
  );
  const fragments = sockets.filter((socket) =>
    socket.plug?.plugCategoryIdentifier.includes("fragments")
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
  )[0];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid w-fit grid-cols-2 gap-4">
        <div className="flex items-center justify-center">
          <SubclassSocket super={subclassSuper} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <TypographyLarge>Abilities</TypographyLarge>
            <div className="grid w-fit grid-cols-2 gap-4">
              {abilities.map((ability, index) => (
                <ModSocket key={index} socket={ability} />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <TypographyLarge>Aspects</TypographyLarge>
            <div className="grid w-fit grid-cols-2 gap-4">
              {aspects.map((aspect, index) => (
                <ModSocket key={index} socket={aspect} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <TypographyLarge>Fragments</TypographyLarge>
      <div className="flex space-x-4">
        {fragments.map((fragment, index) => (
          <ModSocket key={index} socket={fragment} />
        ))}
      </div>
    </div>
  );
};
