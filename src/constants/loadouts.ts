import {
  DestinyClassType,
  DestinyDamageType,
  LoadoutTag,
} from "@prisma/client";
import { DestinyClass } from "bungie-api-ts/destiny2";

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

export const bungieCharacterClassToDbClassMap = {
  0: DestinyClassType.TITAN,
  1: DestinyClassType.HUNTER,
  2: DestinyClassType.WARLOCK,
};

export const bungieDamageTypeToDbDamageTypeMap = {
  2: DestinyDamageType.ARC,
  3: DestinyDamageType.SOLAR,
  4: DestinyDamageType.VOID,
  6: DestinyDamageType.STATIS,
  7: DestinyDamageType.STRAND,
};

export const characterClassIconPathMap = {
  [DestinyClassType.TITAN]: "/destiny-icons/classes/titan.svg",
  [DestinyClassType.HUNTER]: "/destiny-icons/classes/hunter.svg",
  [DestinyClassType.WARLOCK]: "/destiny-icons/classes/warlock.svg",
};

export const bungieDestinyClassToDbCharacterClassMap = {
  [DestinyClass.Hunter]: DestinyClassType.HUNTER,
  [DestinyClass.Warlock]: DestinyClassType.WARLOCK,
  [DestinyClass.Titan]: DestinyClassType.TITAN,
  [DestinyClass.Unknown]: null,
};

export const damageTypeIconPathMap = {
  [DestinyDamageType.ARC]: "/destiny-icons/damage/arc.svg",
  [DestinyDamageType.VOID]: "/destiny-icons/damage/void.svg",
  [DestinyDamageType.SOLAR]: "/destiny-icons/damage/solar.svg",
  [DestinyDamageType.STATIS]: "/destiny-icons/damage/stasis.svg",
  [DestinyDamageType.STRAND]: null,
};

export const damageTypesColorMap = {
  [DestinyDamageType.ARC]: "#79bbe8",
  [DestinyDamageType.VOID]: "#8e749e",
  [DestinyDamageType.SOLAR]: "#f0631e",
  [DestinyDamageType.STATIS]: "#4d88ff",
  [DestinyDamageType.STRAND]: "#35e366",
};
