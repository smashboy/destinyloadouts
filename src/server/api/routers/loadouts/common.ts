import { type Prisma } from "@prisma/client";

export const LoadoutPreviewIncludeCommon = (userId: string) => {
  const include = {
    bookmarks: {
      where: {
        savedByUserId: userId,
      },
      select: {
        savedByUserId: true,
      },
    },
    likes: {
      where: {
        likedByUserId: userId,
      },
      select: {
        likedByUserId: true,
      },
    },
    _count: {
      select: {
        likes: true,
      },
    },
  } satisfies Prisma.LoadoutInclude;

  return include;
};
