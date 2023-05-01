import {
  DestinyClassType,
  DestinyDamageType,
  LoadoutTag,
} from "@prisma/client";
import {
  DamageType,
  DestinyAmmunitionType,
  DestinyClass,
} from "~/bungie/__generated";

export const LoadoutTagsList = [
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

export const DestinyCharacterClassTypesList = [
  DestinyClassType.HUNTER,
  DestinyClassType.TITAN,
  DestinyClassType.WARLOCK,
];

export const DamageTypesList = [
  DestinyDamageType.ARC,
  DestinyDamageType.VOID,
  DestinyDamageType.SOLAR,
  DestinyDamageType.STATIS,
  DestinyDamageType.STRAND,
];

export const LoadoutStat = {
  DISCIPLINE: 0,
  INTELLECT: 1,
  MOBILITY: 2,
  RECOVERY: 3,
  RESILIENCE: 4,
  STRENGTH: 5,
} as const;

export type LoadoutStatType = (typeof LoadoutStat)[keyof typeof LoadoutStat];

export const LoadoutStatsList = [
  LoadoutStat.DISCIPLINE,
  LoadoutStat.INTELLECT,
  LoadoutStat.MOBILITY,
  LoadoutStat.RECOVERY,
  LoadoutStat.RESILIENCE,
  LoadoutStat.STRENGTH,
];

export type LoadoutStatsListType = typeof LoadoutStatsList;

export const LoadoutStatIconsMap = {
  [LoadoutStat.DISCIPLINE]: "/destiny-icons/stats/discipline.svg",
  [LoadoutStat.INTELLECT]: "/destiny-icons/stats/intellect.svg",
  [LoadoutStat.MOBILITY]: "/destiny-icons/stats/mobility.svg",
  [LoadoutStat.RECOVERY]: "/destiny-icons/stats/recovery.svg",
  [LoadoutStat.RESILIENCE]: "/destiny-icons/stats/resilience.svg",
  [LoadoutStat.STRENGTH]: "/destiny-icons/stats/strength.svg",
};

export const LoadoutStatTitleMap = {
  [LoadoutStat.DISCIPLINE]: "Discipline",
  [LoadoutStat.INTELLECT]: "Intellect",
  [LoadoutStat.MOBILITY]: "Mobility",
  [LoadoutStat.RECOVERY]: "Recovery",
  [LoadoutStat.RESILIENCE]: "Resilience",
  [LoadoutStat.STRENGTH]: "Strength",
};

export const LoadoutTagIconsMap = {
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

export const LoadoutTagTitlesMap = {
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

export const CharacterClassIconPathMap = {
  [DestinyClassType.TITAN]: "/destiny-icons/classes/titan.svg",
  [DestinyClassType.HUNTER]: "/destiny-icons/classes/hunter.svg",
  [DestinyClassType.WARLOCK]: "/destiny-icons/classes/warlock.svg",
};

export const CharacterClassTitleMap = {
  [DestinyClassType.TITAN]: "Titan",
  [DestinyClassType.HUNTER]: "Hunter",
  [DestinyClassType.WARLOCK]: "Warlock",
};

export const BungieDestinyClassToDbCharacterClassMap = {
  [DestinyClass.Hunter]: DestinyClassType.HUNTER,
  [DestinyClass.Warlock]: DestinyClassType.WARLOCK,
  [DestinyClass.Titan]: DestinyClassType.TITAN,
};

export const BungieDamageTypeToDbDamageTypeMap = {
  [DamageType.Arc]: DestinyDamageType.ARC,
  [DamageType.Thermal]: DestinyDamageType.SOLAR,
  [DamageType.Void]: DestinyDamageType.VOID,
  [DamageType.Stasis]: DestinyDamageType.STATIS,
  [DamageType.Strand]: DestinyDamageType.STRAND,
};

export const DamageTypeTitleMap = {
  [DestinyDamageType.ARC]: "Arc",
  [DestinyDamageType.VOID]: "Void",
  [DestinyDamageType.SOLAR]: "Solar",
  [DestinyDamageType.STATIS]: "Stasis",
  [DestinyDamageType.STRAND]: "Strand",
};

export const DamageTypeIconPathMap = {
  [DestinyDamageType.ARC]: "/destiny-icons/damage/arc.svg",
  [DestinyDamageType.VOID]: "/destiny-icons/damage/void.svg",
  [DestinyDamageType.SOLAR]: "/destiny-icons/damage/solar.svg",
  [DestinyDamageType.STATIS]: "/destiny-icons/damage/stasis.svg",
  [DestinyDamageType.STRAND]: null,
};

export const DamageTypeColorMap = {
  [DestinyDamageType.ARC]: "#79bbe8",
  [DestinyDamageType.VOID]: "#8e749e",
  [DestinyDamageType.SOLAR]: "#f0631e",
  [DestinyDamageType.STATIS]: "#4d88ff",
  [DestinyDamageType.STRAND]: "#35e366",
};

export const AmmunitionIconMap = {
  [DestinyAmmunitionType.Primary]: "/destiny-icons/ammo/primary.svg",
  [DestinyAmmunitionType.Special]: "/destiny-icons/ammo/special.svg",
  [DestinyAmmunitionType.Heavy]: "/destiny-icons/ammo/heavy.svg",
  [DestinyAmmunitionType.None]: null,
  [DestinyAmmunitionType.Unknown]: null,
};
