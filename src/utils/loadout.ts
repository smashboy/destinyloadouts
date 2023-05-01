import { type User } from "@prisma/client";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { type LoadoutItem, type LoadoutPerkItemsList } from "~/bungie/types";
import { type LoadoutStatType } from "~/constants/loadouts";

export const getLoadoutItemHashes = (
  loadout: Record<string, LoadoutItem>
): string[] => {
  const hashes: string[] = [];

  for (const item of Object.values(loadout)) {
    if (item)
      hashes.push(
        ...[item[0].toString(), ...item[1].map((hash) => hash.toString())]
      );
  }

  return hashes;
};

interface Loadout {
  id: string;
  _count: { likes: number };
  likes?: Array<{ likedByUserId: string }>;
  bookmarks?: Array<{ savedByUserId: string }>;
}

interface HandleAuthUserLoadoutLikeProps<L extends Loadout> {
  loadoutId: string;
  loadout: L;
  authUser: User | undefined;
}

export const handleAuthUserLoadoutLike = <L extends Loadout>({
  loadout,
  loadoutId,
  authUser,
}: HandleAuthUserLoadoutLikeProps<L>) => {
  const { _count, id, likes = [], ...loadoutProps } = loadout;

  const isLikedByAuthUser =
    id === loadoutId &&
    likes.find((like) => like.likedByUserId === authUser?.id);

  return {
    ...loadoutProps,
    id,
    likes: isLikedByAuthUser
      ? likes.filter((like) => like.likedByUserId !== authUser?.id)
      : id === loadoutId
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [...likes, { likedByUserId: authUser!.id }]
      : [...likes],
    _count: {
      ..._count,
      likes: isLikedByAuthUser
        ? _count.likes - 1
        : id === loadoutId
        ? _count.likes + 1
        : _count.likes,
    },
  };
};

export const handleAuthUserLoadoutBookmark = <L extends Loadout>({
  loadout,
  loadoutId,
  authUser,
}: HandleAuthUserLoadoutLikeProps<L>) => {
  const { id, bookmarks = [], ...loadoutProps } = loadout;

  const isSavedByAuthUser =
    id === loadoutId &&
    bookmarks.find((bookmark) => bookmark.savedByUserId === authUser?.id);

  return {
    ...loadoutProps,
    id,
    bookmarks: isSavedByAuthUser
      ? bookmarks.filter((bookmark) => bookmark.savedByUserId !== authUser?.id)
      : id === loadoutId
      ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [...bookmarks, { savedByUserId: authUser!.id }]
      : [...bookmarks],
  };
};

export const getInventoryItemPerks = (
  items: DestinyInventoryItemDefinition[],
  perks: LoadoutPerkItemsList
) =>
  items.map((item) =>
    item.perks
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .map((perk) => perks[perk.perkHash]!)
      .filter((perk) => perk && perk.isDisplayable)
  );

export const parseLoadoutStatsPriority = (stats: string | null) =>
  stats
    ? (stats
        .split(",")
        .map((stat) => Number(stat)) as unknown as LoadoutStatType[])
    : [];
