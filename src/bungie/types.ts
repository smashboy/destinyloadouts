import {
  type DestinyInventoryItemDefinition,
  type DestinySandboxPerkDefinition,
} from "bungie-api-ts/destiny2";

export type LoadoutItem = [number, number[]] | null | undefined;

export type LoadoutInventoryItemsList = Record<
  number,
  DestinyInventoryItemDefinition
>;

export type LoadoutPerkItemsList = Record<number, DestinySandboxPerkDefinition>;

export interface DestinyCharacterLoadout {
  helmet: LoadoutItem;
  gauntlets: LoadoutItem;
  chest: LoadoutItem;
  legs: LoadoutItem;
  class: LoadoutItem;
  kinetic: LoadoutItem;
  energy: LoadoutItem;
  power: LoadoutItem;
  subclass: LoadoutItem;
  inventoryItems: LoadoutInventoryItemsList;
  perkItems?: LoadoutPerkItemsList;
}
