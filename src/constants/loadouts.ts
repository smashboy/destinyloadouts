import {
  DestinyClassType,
  DestinyDamageType,
  LoadoutTag,
} from "@prisma/client";
import { DamageType, DestinyClass } from "~/bungie/__generated";

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

export const destinyCharacterClassTypesList = [
  DestinyClassType.HUNTER,
  DestinyClassType.TITAN,
  DestinyClassType.WARLOCK,
];

export const damageTypesList = [
  DestinyDamageType.ARC,
  DestinyDamageType.VOID,
  DestinyDamageType.SOLAR,
  DestinyDamageType.STATIS,
  DestinyDamageType.STRAND,
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
  [LoadoutTag.RAID]: "Raids",
  [LoadoutTag.CRUCIBLE]: "Crucible",
  [LoadoutTag.DUNGEON]: "Dungeons",
  [LoadoutTag.VANGUARD]: "Vanguard",
  [LoadoutTag.TRIALS]: "Trials",
  [LoadoutTag.FASHION]: "Fashion",
};

export const characterClassIconPathMap = {
  [DestinyClassType.TITAN]: "/destiny-icons/classes/titan.svg",
  [DestinyClassType.HUNTER]: "/destiny-icons/classes/hunter.svg",
  [DestinyClassType.WARLOCK]: "/destiny-icons/classes/warlock.svg",
};

export const characterClassTitleMap = {
  [DestinyClassType.TITAN]: "Titan",
  [DestinyClassType.HUNTER]: "Hunter",
  [DestinyClassType.WARLOCK]: "Warlcock",
};

export const bungieDestinyClassToDbCharacterClassMap = {
  [DestinyClass.Hunter]: DestinyClassType.HUNTER,
  [DestinyClass.Warlock]: DestinyClassType.WARLOCK,
  [DestinyClass.Titan]: DestinyClassType.TITAN,
};

export const bungieDamageTypeToDbDamageTypeMap = {
  [DamageType.Arc]: DestinyDamageType.ARC,
  [DamageType.Thermal]: DestinyDamageType.SOLAR,
  [DamageType.Void]: DestinyDamageType.VOID,
  [DamageType.Stasis]: DestinyDamageType.STATIS,
  [DamageType.Strand]: DestinyDamageType.STRAND,
};

export const damageTypeTitleMap = {
  [DestinyDamageType.ARC]: "Arc",
  [DestinyDamageType.VOID]: "Void",
  [DestinyDamageType.SOLAR]: "Solar",
  [DestinyDamageType.STATIS]: "Stasis",
  [DestinyDamageType.STRAND]: "Strand",
};

export const damageTypeIconPathMap = {
  [DestinyDamageType.ARC]: "/destiny-icons/damage/arc.svg",
  [DestinyDamageType.VOID]: "/destiny-icons/damage/void.svg",
  [DestinyDamageType.SOLAR]: "/destiny-icons/damage/solar.svg",
  [DestinyDamageType.STATIS]: "/destiny-icons/damage/stasis.svg",
  [DestinyDamageType.STRAND]: null,
};

export const damageTypeColorMap = {
  [DestinyDamageType.ARC]: "#79bbe8",
  [DestinyDamageType.VOID]: "#8e749e",
  [DestinyDamageType.SOLAR]: "#f0631e",
  [DestinyDamageType.STATIS]: "#4d88ff",
  [DestinyDamageType.STRAND]: "#35e366",
};
