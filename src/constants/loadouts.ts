import { LoadoutTag } from "@prisma/client";

export const loadoutTagsList = [
  LoadoutTag.PVE,
  LoadoutTag.PVP,
  LoadoutTag.VANGUARD,
  LoadoutTag.CRUCIBLE,
  LoadoutTag.GAMBIT,
  LoadoutTag.RAID,
  LoadoutTag.DUNGEON,
  LoadoutTag.TRIALS,
  LoadoutTag.FASHION,
];

export const loadoutTagIconsMap = {
  [LoadoutTag.PVE]: null,
  [LoadoutTag.PVP]: null,
  [LoadoutTag.GAMBIT]: "/destiny-icons/activities/gambit.svg",
  [LoadoutTag.RAID]: "/destiny-icons/activities/raid.svg",
  [LoadoutTag.CRUCIBLE]: "/destiny-icons/activities/crucible.svg",
  [LoadoutTag.DUNGEON]: "/destiny-icons/activities/dungeon_.svg",
  [LoadoutTag.VANGUARD]: "/destiny-icons/activities/vanguard.svg",
  [LoadoutTag.TRIALS]: "/destiny-icons/activities/trials.svg",
  [LoadoutTag.FASHION]: "/destiny-icons/armor/helmet.svg",
};

export const loadoutTagTitlesMap = {
  [LoadoutTag.PVE]: "PvE",
  [LoadoutTag.PVP]: "PvP",
  [LoadoutTag.GAMBIT]: "Gambit",
  [LoadoutTag.RAID]: "Raid",
  [LoadoutTag.CRUCIBLE]: "Crucible",
  [LoadoutTag.DUNGEON]: "Dungeon",
  [LoadoutTag.VANGUARD]: "Vanguard",
  [LoadoutTag.TRIALS]: "Trials",
  [LoadoutTag.FASHION]: "Fashion",
};
