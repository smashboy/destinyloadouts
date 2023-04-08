import { type Prisma } from "@prisma/client";

interface LoadoutPreviewIncludeCommonProps {
  includeAuthor?: boolean;
  authUserId?: string;
}

export const LoadoutPreviewIncludeCommon = ({
  includeAuthor = false,
  authUserId,
}: LoadoutPreviewIncludeCommonProps = {}) => {
  const include = {
    ...(authUserId && {
      bookmarks: {
        where: {
          savedByUserId: authUserId,
        },
        select: {
          savedByUserId: true,
        },
      },
      likes: {
        where: {
          likedByUserId: authUserId,
        },
        select: {
          likedByUserId: true,
        },
      },
    }),
    author: includeAuthor,
    _count: {
      select: {
        likes: true,
      },
    },
  } satisfies Prisma.LoadoutInclude;

  return include;
};

export const LoadoutLikesSelectCommon = (authBungieAccountId?: string) => {
  const select = {
    id: true,
    _count: {
      select: {
        likes: true,
      },
    },
    ...(authBungieAccountId && {
      likes: {
        where: {
          likedBy: {
            bungieAccountId: authBungieAccountId,
          },
        },
        select: {
          likedByUserId: true,
        },
      },
      bookmarks: {
        where: {
          savedBy: {
            bungieAccountId: authBungieAccountId,
          },
        },
        select: {
          savedByUserId: true,
        },
      },
    }),
  } satisfies Prisma.LoadoutSelect;

  return select;
};
