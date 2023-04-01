import Link from "next/link";
import Image from "next/image";
import { type Loadout } from "@prisma/client";
import { IconHeart, IconBookmark } from "@tabler/icons-react";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import {
  characterClassIconPathMap,
  damageTypeIconPathMap,
} from "~/constants/loadouts";
import { TypographyLarge, TypographySmall } from "../typography";
import { Separator } from "../Separator";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import { LoadoutWeaponItem } from "../destiny/LoadoutWeaponItem";
import { LoadoutArmorItem } from "../destiny/LoadoutArmorItem";
import { LoadoutSubclassItem } from "../destiny/LoadoutSubclassItem";

interface LoadoutPreviewCardProps {
  loadout: Loadout;
  inventoryItems: Record<string, DestinyInventoryItemDefinition>;
}

export const LoadoutPreviewCard: React.FC<LoadoutPreviewCardProps> = ({
  loadout: { authorId, id, classType, subclassType, tags, name, items },
  inventoryItems,
}) => {
  const loadoutLink = `${authorId}/${id}`;

  const classIcon = characterClassIconPathMap[classType];
  const subclassIcon = damageTypeIconPathMap[subclassType];

  const {
    kinetic,
    energy,
    power,
    helmet,
    gauntlets,
    chest,
    legs,
    subclass,
    class: classItem,
  } = items as unknown as DestinyCharacterLoadout;

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={loadoutLink}
        className="relative flex w-full gap-4 overflow-hidden rounded p-3 transition duration-300 ease-out dark:bg-neutral-800 hover:dark:bg-neutral-700"
      >
        <Image
          src={classIcon}
          alt="Destiny character class type icon"
          width={64}
          height={64}
          className="dark:invert"
        />
        {/* <span
        className="absolute inset-y-0 right-0 w-1/2"
        style={{
          backgroundColor: damageTypesColorMap[DestinyDamageType.ARC],
          // opacity: 0.3,
          boxShadow: "rgba(121, 187, 232, 1) -20px 0px 20px 20px",
        }}
      /> */}
        {/* border-2 border-solid border-slate-300 */}

        <span className="flex flex-1 flex-col gap-2">
          <TypographyLarge>{name}</TypographyLarge>
          <span className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="flex space-x-2">
                <TypographySmall>{tag}</TypographySmall>
                <Separator orientation="vertical" />
              </span>
            ))}
          </span>

          <div className="flex gap-4 py-3">
            <LoadoutSubclassItem
              item={subclass}
              inventoryItems={inventoryItems}
              hideSockets
            />
            <Separator orientation="vertical" />
            <LoadoutWeaponItem
              item={kinetic}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/kinetic.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutWeaponItem
              item={energy}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/energy.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutWeaponItem
              item={power}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/power.svg",
              }}
              isSm
              hideSockets
            />
            <Separator orientation="vertical" />
            <LoadoutArmorItem
              item={helmet}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/helmet.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutArmorItem
              item={gauntlets}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/gloves.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutArmorItem
              item={chest}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/chest.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutArmorItem
              item={legs}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/boots.svg",
              }}
              isSm
              hideSockets
            />
            <LoadoutArmorItem
              item={classItem}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/class.svg",
              }}
              isSm
              hideSockets
            />
          </div>
        </span>
      </Link>
      <div className="flex flex-row-reverse gap-2">
        <IconBookmark />
        <div className="flex items-center gap-2">
          <TypographySmall>43291</TypographySmall>
          <IconHeart />
        </div>
      </div>
    </div>
  );
};
