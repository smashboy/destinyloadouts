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
