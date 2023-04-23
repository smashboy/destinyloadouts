export const DestinyItemSubType = {
  None: 0,
  Crucible: 1,
  Vanguard: 2,
  Exotic: 5,
  AutoRifle: 6,
  Shotgun: 7,
  Machinegun: 8,
  HandCannon: 9,
  RocketLauncher: 10,
  FusionRifle: 11,
  SniperRifle: 12,
  PulseRifle: 13,
  ScoutRifle: 14,
  Crm: 16,
  Sidearm: 17,
  Sword: 18,
  Mask: 19,
  Shader: 20,
  Ornament: 21,
  FusionRifleLine: 22,
  GrenadeLauncher: 23,
  SubmachineGun: 24,
  TraceRifle: 25,
  HelmetArmor: 26,
  GauntletsArmor: 27,
  ChestArmor: 28,
  LegArmor: 29,
  ClassArmor: 30,
  Bow: 31,
  DummyRepeatableBounty: 32,
  Glaive: 33,
} as const;

export type DestinyItemSubTypeConst = typeof DestinyItemSubType;

export const DestinyItemType = {
  None: 0,
  Currency: 1,
  Armor: 2,
  Weapon: 3,
  Message: 7,
  Engram: 8,
  Consumable: 9,
  ExchangeMaterial: 10,
  MissionReward: 11,
  QuestStep: 12,
  QuestStepComplete: 13,
  Emblem: 14,
  Quest: 15,
  Subclass: 16,
  ClanBanner: 17,
  Aura: 18,
  Mod: 19,
  Dummy: 20,
  Ship: 21,
  Vehicle: 22,
  Emote: 23,
  Ghost: 24,
  Package: 25,
  Bounty: 26,
  Wrapper: 27,
  SeasonalArtifact: 28,
  Finisher: 29,
  Pattern: 30,
} as const;

export type DestinyItemTypeConst = typeof DestinyItemType;

export const DestinyComponentType = {
  None: 0,
  Profiles: 100,
  VendorReceipts: 101,
  ProfileInventories: 102,
  ProfileCurrencies: 103,
  ProfileProgression: 104,
  PlatformSilver: 105,
  Characters: 200,
  CharacterInventories: 201,
  CharacterProgressions: 202,
  CharacterRenderData: 203,
  CharacterActivities: 204,
  CharacterEquipment: 205,
  CharacterLoadouts: 206,
  ItemInstances: 300,
  ItemObjectives: 301,
  ItemPerks: 302,
  ItemRenderData: 303,
  ItemStats: 304,
  ItemSockets: 305,
  ItemTalentGrids: 306,
  ItemCommonData: 307,
  ItemPlugStates: 308,
  ItemPlugObjectives: 309,
  ItemReusablePlugs: 310,
  Vendors: 400,
  VendorCategories: 401,
  VendorSales: 402,
  Kiosks: 500,
  CurrencyLookups: 600,
  PresentationNodes: 700,
  Collectibles: 800,
  Records: 900,
  Transitory: 1000,
  Metrics: 1100,
  StringVariables: 1200,
  Craftables: 1300,
  SocialCommendations: 1400,
} as const;

export type DestinyComponentTypeConst = typeof DestinyComponentType;

export const DestinyClass = {
  Titan: 0,
  Hunter: 1,
  Warlock: 2,
  Unknown: 3,
} as const;

export type DestinyClassConst = typeof DestinyClass;

export const DamageType = {
  None: 0,
  Kinetic: 1,
  Arc: 2,
  Thermal: 3,
  Void: 4,
  Raid: 5,
  Stasis: 6,
  Strand: 7,
} as const;

export type DamageTypeConst = typeof DamageType;

export const DestinyRace = {
  Human: 0,
  Awoken: 1,
  Exo: 2,
  Unknown: 3,
} as const;

export type DestinyRaceConst = typeof DestinyRace;

export const DestinyAmmunitionType = {
  None: 0,
  Primary: 1,
  Special: 2,
  Heavy: 3,
  Unknown: 4,
} as const;

export type DestinyAmmunitionTypeConst = typeof DestinyAmmunitionType;

export const ItemPerkVisibility = {
  Visible: 0,
  Disabled: 1,
  Hidden: 2,
} as const;

export type ItemPerkVisibilityConst = typeof ItemPerkVisibility;
