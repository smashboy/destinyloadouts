"use client";
import { DestinyContentLoadoutNameList } from "@/core/bungie-api/types";
import { TypographyLarge } from "@/core/components/typography";
import { useLoadouts } from "@/core/stores/LoadoutContext";

interface LoadoutNameProps {
  loadoutIndex: string;
  loadoutNames: DestinyContentLoadoutNameList;
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
