import { LoadoutItem } from "@destiny/shared/types";
import { DestinyManifest, Loadout, prisma } from "../../prisma/client";
import { PrismaLoadoutItemsJson } from "./types";
import { formatPrismaDestinyManifestTableComponent } from "./manifest";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export const getLoadoutsInventoryItems = async (
  prismaLoadouts: Loadout[],
  manifest: DestinyManifest
): Promise<DestinyInventoryItemDefinition[]> => {
  const itemHashes: number[] = [];

  for (const loadout of prismaLoadouts) {
    const items = (loadout.items as unknown as PrismaLoadoutItemsJson)
      .loadout as unknown as Record<string, LoadoutItem>;

    for (const item of Object.values(items)) {
      if (item) {
        itemHashes.push(...[item[0], ...item[1]]);
      }
    }
  }

  if (itemHashes.length === 0) return [];

  const components = await prisma.destinyManifestTableComponent.findMany({
    where: {
      AND: [
        {
          manifestVersion: manifest.version,
        },
        {
          localeName: "en",
        },
        { tableName: "DestinyInventoryItemDefinition" },
        {
          hashId: {
            in: [...new Set(itemHashes.map((hash) => hash.toString()))],
          },
        },
      ],
    },
  });

  return components.map((component) =>
    formatPrismaDestinyManifestTableComponent<DestinyInventoryItemDefinition>(
      component
    )
  );
};
