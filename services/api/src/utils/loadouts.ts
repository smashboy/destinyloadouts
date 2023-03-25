import { Loadout } from "@prisma/client";
import { LoadoutItem } from "@destiny/shared/types";
import { PrismaLoadoutItemsJson } from "./types";
import { manifestServiceClient } from "./manifestServiceClient";
import { formatPrismaDestinyManifestTableComponent } from "./manifest";
import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

export const getLoadoutsInventoryItems = async (
  prismaLoadouts: Loadout[]
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

  const components =
    await manifestServiceClient.destiny.manifest.latest.getTableComponents.query(
      {
        tableName: "DestinyInventoryItemDefinition",
        locale: "en",
        hashIds: [...new Set(itemHashes.map((hash) => hash.toString()))],
      }
    );

  return components.map((component) =>
    formatPrismaDestinyManifestTableComponent<DestinyInventoryItemDefinition>(
      component
    )
  );
};
