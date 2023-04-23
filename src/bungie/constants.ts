export const bungieNetOrigin = "https://www.bungie.net";

export const characterClassIconPathMap = {
  0: "/destiny-icons/classes/titan.svg",
  1: "/destiny-icons/classes/hunter.svg",
  2: "/destiny-icons/classes/warlock.svg",
};

export const characterRaceTypeTitleMap = {
  0: "Human",
  1: "Awoken",
  2: "Exo",
};

export const destinyLogoIconPath = "/destiny-icons/destiny.svg";

export const destinyManifestTableNames = [
  "DestinyLoadoutNameDefinition",
  "DestinyLoadoutColorDefinition",
  "DestinyLoadoutIconDefinition",
  "DestinyInventoryItemDefinition",
  "DestinyItemCategoryDefinition",
  "DestinySandboxPerkDefinition",
] as const; // satisfies DestinyManifestComponentName[]

export const DestinyItemCategoryHash = {
  KineticWeapon: 2,
  EnergyWeapon: 3,
  PowerWeapon: 4,
};
