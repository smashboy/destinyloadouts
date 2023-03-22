import {
  DestinyInventoryItemDefinition,
  DestinyLoadoutItemComponent,
  DestinyItemResponse,
} from "bungie-api-ts/destiny2";

export type LoadoutItem =
  | [DestinyLoadoutItemComponent, DestinyItemResponse]
  | null;

export type LoadoutInventoryItemsList = Record<
  number,
  DestinyInventoryItemDefinition
>;

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
}
