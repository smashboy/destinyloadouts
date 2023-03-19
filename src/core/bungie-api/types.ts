import {
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
} from "bungie-api-ts/destiny2";

export type LoadoutItem = {
  item: DestinyItemResponse;
  inventoryItem: DestinyInventoryItemDefinition;
  overrideStyleInventoryItem: DestinyInventoryItemDefinition | null;
} | null;

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
}
