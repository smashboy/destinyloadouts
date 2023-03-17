export interface DestinyApiClientProps {
  apiKey: string;
}

export interface DestinyApiHeaders {
  "X-API-Key": string;
  Authorization?: string;
  [k: string]: string;
}

export interface BungieNetApiResponse<T> {
  Response: T;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: { [key: string]: string };
}

export interface BungieNetUser {
  uniqueName: string;
  membershipId: string;
  displayName: string;
  about: string;
  profilePicturePath: string;
  twitchDisplayName?: string;
  steamDisplayName?: string;
  xboxDisplayName?: string;
  psnDisplayName?: string;
}

export interface DestinyMembership {
  membershipId: string;
  membershipType: number; // 0 = none, xbox = 1, psn = 2, steam = 3, blizzard = 4, stadia = 5, egs = 6, demon = 10, next = 254, all = -1
}

export interface DestinyCharacter {
  classType: number; // titan = 0, hunter = 1, warlock = 2, unkown = 3
  characterId: string;
  emblemPath: string;
  emblemBackgroundPath: string;
  genderType: number; // human = 0, awoken = 1, exo = 2, unkown = 3
  light: number;
  // kineticWeapon: DestinyItem;
  // energyWeapon: DestinyItem;
  // powerWeapon: DestinyItem;
  // helmet: DestinyItem;
  // gauntlets: DestinyItem;
  // chestArmor: DestinyItem;
  // legArmor: DestinyItem;
  // classArmor: DestinyItem;
}

// export interface DestinyItem {
//   itemInstanceId: string;
//   itemHash: number;
//   itemDefinition: DestinyItemDefinition;
// }

// export interface DestinyItemDefinition {
//   displayProperties: {
//     name: string;
//     description: string;
//     icon: string;
//   };
// }

export interface DestinyCharacterLoadout {
  iconHash: string;
  colorHash: string;
  nameHash: string;
  items: DestinyCharacterLoadoutItem[];
}

export interface DestinyCharacterLoadoutItem {
  itemInstanceId: string;
}

export interface DestinyManifest {
  jsonWorldComponentContentPaths: Record<
    string,
    DestinyManifestJsonWorldComponentContentPathsData
  >;
}

export interface DestinyManifestJsonWorldComponentContentPathsData {
  DestinyLoadoutColorDefinition: string;
  DestinyLoadoutIconDefinition: string;
  DestinyLoadoutNameDefinition: string;
}

export type DestinyContentLoadoutIconList = Record<
  string,
  DestinyContentLoadoutIconItem
>;
export type DestinyContentLoadoutColorList = Record<
  string,
  DestinyContentLoadoutColorItem
>;
export type DestinyContentLoadoutNameList = Record<
  string,
  DestinyContentLoadoutNameItem
>;

export interface DestinyContentLoadoutIconItem {
  iconImagePath: string;
}

export interface DestinyContentLoadoutColorItem {
  colorImagePath: string;
}

export interface DestinyContentLoadoutNameItem {
  name: string;
}
