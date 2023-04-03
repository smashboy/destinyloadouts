import { type Loadout, type User } from "@prisma/client";
import { type LoadoutItem } from "~/bungie/types";

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

interface HandleAuthUserLoadoutLikeProps {
  loadoutId: string;
  loadout: Loadout & {
    _count: { likes: number };
    likes: Array<{ likedByUserId: string }>;
    bookmarks: Array<{ savedByUserId: string }>;
    author: User;
  };
  authUser: User | undefined;
}

export const handleAuthUserLoadoutLike = ({
  loadout,
  loadoutId,
  authUser,
}: HandleAuthUserLoadoutLikeProps) => {
  const { _count, id, likes, ...loadoutProps } = loadout;

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

export const handleAuthUserLoadoutBookmark = ({
  loadout,
  loadoutId,
  authUser,
}: HandleAuthUserLoadoutLikeProps) => {
  const { id, bookmarks, ...loadoutProps } = loadout;

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
