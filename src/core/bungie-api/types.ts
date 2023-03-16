export interface DestinyApiClientProps {
  apiKey: string;
}

export interface DestinyApiHeaders {
  "X-API-Key": string;
  [k: string]: string;
}

export interface BungieNetApiResponse<T> {
  Repsonse: T;
  ErrorCode: number;
  ThrottleSeconds: number;
  ErrorStatus: string;
  Message: string;
  MessageData: { [key: string]: string };
}

export interface DestinyCharacter {
  classType: number;
  emblemPath: string;
  emblemBackgroundPath: string;
  emblemColor: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  };
  kineticWeapon: DestinyItem;
  energyWeapon: DestinyItem;
  powerWeapon: DestinyItem;
  helmet: DestinyItem;
  gauntlets: DestinyItem;
  chestArmor: DestinyItem;
  legArmor: DestinyItem;
  classArmor: DestinyItem;
}

export interface DestinyItem {
  itemInstanceId: string;
  itemHash: number;
  itemDefinition: DestinyItemDefinition;
}

export interface DestinyItemDefinition {
  displayProperties: {
    name: string;
    description: string;
    icon: string;
  };
}
