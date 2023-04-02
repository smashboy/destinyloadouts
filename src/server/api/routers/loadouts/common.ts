import { type Prisma } from "@prisma/client";

interface LoadoutPreviewIncludeCommonProps {
  includeAuthor?: boolean;
}

export const LoadoutPreviewIncludeCommon = (
  userId?: string,
  { includeAuthor }: LoadoutPreviewIncludeCommonProps = {}
) => {
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
    author: includeAuthor,
    _count: {
      select: {
        likes: true,
      },
    },
  } satisfies Prisma.LoadoutInclude;

  return include;
};
