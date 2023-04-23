import { type prisma as p } from "~/server/db";
import { type Prisma } from "@prisma/client";
import {
  type DestinyInventoryItemDefinition,
  type DestinySandboxPerkDefinition,
} from "bungie-api-ts/destiny2";
import { destinyLatestManifestRouterCaller } from "../destiny/manifest/latest";
import { formatPrismaDestinyManifestTableComponents } from "~/server/utils/manifest";
import { ItemPerkVisibility } from "~/bungie/__generated";

interface LoadoutIncludeCommonProps {
  includeAuthor?: boolean;
  authUserId?: string;
}

export const LoadoutIncludeCommon = ({
  includeAuthor = false,
  authUserId,
}: LoadoutIncludeCommonProps = {}) => {
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
    tags: true,
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

export const fetchInventoryItems = async (
  prisma: typeof p,
  initialHashIds: string[]
) => {
  const manifestCaller = destinyLatestManifestRouterCaller({
    prisma,
    session: null,
  });

  const inventoryItems = await manifestCaller.getTableComponents({
    tableName: "DestinyInventoryItemDefinition",
    locale: "en",
    hashIds: initialHashIds,
  });

  const perkHashes: string[] = [];

  for (const item of inventoryItems) {
    const content = item.content as unknown as DestinyInventoryItemDefinition;

    for (const perk of content.perks) {
      const hash = perk.perkHash.toString();

      if (
        perk.perkVisibility === ItemPerkVisibility.Visible &&
        perkHashes.indexOf(hash) === -1
      ) {
        perkHashes.push(hash);
      }
    }
  }

  const perkItems = await manifestCaller.getTableComponents({
    tableName: "DestinySandboxPerkDefinition",
    locale: "en",
    hashIds: perkHashes,
  });

  return {
    inventoryItems:
      formatPrismaDestinyManifestTableComponents<
        Record<string, DestinyInventoryItemDefinition>
      >(inventoryItems),
    perkItems:
      formatPrismaDestinyManifestTableComponents<
        Record<string, DestinySandboxPerkDefinition>
      >(perkItems),
  };
};
