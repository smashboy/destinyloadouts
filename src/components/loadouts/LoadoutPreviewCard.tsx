import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { type Loadout, type User } from "@prisma/client";
import { IconHeart, IconHeartFilled, IconBookmark } from "@tabler/icons-react";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { characterClassIconPathMap } from "~/constants/loadouts";
import { TypographyLarge, TypographySmall } from "../typography";
import { Separator } from "../Separator";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import { LoadoutWeaponItem } from "../destiny/LoadoutWeaponItem";
import { LoadoutArmorItem } from "../destiny/LoadoutArmorItem";
import { LoadoutSubclassItem } from "../destiny/LoadoutSubclassItem";
import { IconButton } from "../IconButton";
import { LoadoutTagsList } from "./LoadoutTagsList";
import { Avatar } from "../Avatar";
import { bungieNetOrigin } from "~/bungie/constants";
import { ButtonLink } from "../Button";

interface LoadoutPreviewCardProps {
  loadout: Loadout & {
    likes?: Array<{ likedByUserId: string }>;
    bookmarks?: Array<{ savedByUserId: string }>;
    _count: { likes: number };
    author: User | undefined;
  };
  inventoryItems: Record<string, DestinyInventoryItemDefinition>;
  onLike: (loadoutId: string) => void;
  onSave: (loadoutId: string) => void;
  authUser?: User;
}

export const LoadoutPreviewCard: React.FC<LoadoutPreviewCardProps> = ({
  loadout: {
    id,
    classType,
    tags,
    name,
    items,
    likes = [],
    bookmarks = [],
    author,
    _count: { likes: likesCount },
  },
  inventoryItems,
  authUser,
  onLike,
  onSave,
}) => {
  const router = useRouter();

  const loadoutLink = `/${id}`;

  const classIcon = characterClassIconPathMap[classType];
  // const subclassIcon = damageTypeIconPathMap[subclassType];

  const isLikedByAuthUser = !!likes.find(
    (like) => like.likedByUserId === authUser?.id
  );

  const isSavedByAuthUser = !!bookmarks.find(
    (like) => like.savedByUserId === authUser?.id
  );

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

  const handleLikeLoadout = () => {
    if (authUser) return onLike(id);
    router.push("/login");
  };
  const handleSaveLoadout = () => {
    if (authUser) return onSave(id);
    router.push("/login");
  };

  return (
    <div className="flex flex-col gap-2">
      {author && (
        <div className="flex items-center gap-0.5">
          <Avatar
            src={`${bungieNetOrigin}/${author.bungieAccountProfilePicturePath}`}
            fallback={author.bungieAccountDisplayName}
            size="xxs"
          />
          <ButtonLink href={`/user/${author.id}`} variant="link">
            {author.bungieAccountDisplayName}
          </ButtonLink>
        </div>
      )}
      <Link
        href={loadoutLink}
        className="relative flex w-full gap-4 overflow-hidden rounded p-3 transition duration-300 ease-out dark:bg-neutral-800 hover:dark:bg-neutral-500"
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <Image
            src={classIcon}
            alt="Destiny character class type icon"
            width={148}
            height={148}
            className="opacity-10 dark:invert"
          />
        </span>

        <span className="flex flex-1 flex-col gap-2">
          <TypographyLarge>{name}</TypographyLarge>
          <LoadoutTagsList tags={tags} />
          <div className="flex gap-4 py-3 pl-2">
            <div className="pr-1">
              <LoadoutSubclassItem
                item={subclass}
                inventoryItems={inventoryItems}
                hideSockets
                isSm
              />
            </div>
            <Separator orientation="vertical" />
            <LoadoutWeaponItem
              item={kinetic}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/kinetic.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutWeaponItem
              item={energy}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/energy.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutWeaponItem
              item={power}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/weapons/power.svg",
              }}
              hideSockets
              isSm
            />
            <Separator orientation="vertical" />
            <LoadoutArmorItem
              item={helmet}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/helmet.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutArmorItem
              item={gauntlets}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/gloves.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutArmorItem
              item={chest}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/chest.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutArmorItem
              item={legs}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/boots.svg",
              }}
              hideSockets
              isSm
            />
            <LoadoutArmorItem
              item={classItem}
              inventoryItems={inventoryItems}
              socketProps={{
                bgIconPath: "/destiny-icons/armor/class.svg",
              }}
              hideSockets
              isSm
            />
          </div>
        </span>
      </Link>

      <div className="flex flex-row-reverse gap-2">
        <div className="flex items-center gap-2">
          <TypographySmall>{likesCount}</TypographySmall>
          <IconButton
            onClick={handleLikeLoadout}
            icon={isLikedByAuthUser ? IconHeartFilled : IconHeart}
          />
          <IconButton
            className={isSavedByAuthUser ? "invert" : void 0}
            onClick={handleSaveLoadout}
            icon={IconBookmark}
          />
        </div>
      </div>
    </div>
  );
};
