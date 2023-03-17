"use client";
import { DestinyLoadoutNameDefinition } from "bungie-api-ts/destiny2";
import { TypographyLarge } from "@/core/components/typography";
import { useLoadouts } from "@/core/stores/LoadoutContext";

interface LoadoutNameProps {
  loadoutIndex: string;
  loadoutNames: Record<string, DestinyLoadoutNameDefinition>;
}

export const LoadoutName: React.FC<LoadoutNameProps> = ({
  loadoutIndex,
  loadoutNames,
}) => {
  const loadouts = useLoadouts();

  const loadout = loadouts[loadoutIndex as unknown as number];
  const loadoutName = loadoutNames[loadout.nameHash]?.name || "Unknown";

  return <TypographyLarge>{loadoutName}</TypographyLarge>;
};
