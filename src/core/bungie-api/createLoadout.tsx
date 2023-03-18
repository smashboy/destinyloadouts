import {
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
} from "bungie-api-ts/destiny2";
import { DestinyItemCategoryHash } from "./consants";

interface Loadout {
  helmet: DestinyItemResponse;
  gauntlets: DestinyItemResponse;
  chest: DestinyItemResponse;
  legs: DestinyItemResponse;
  class: DestinyItemResponse;
  kinetic: DestinyItemResponse;
  energy: DestinyItemResponse;
  power: DestinyItemResponse;
  subclass: DestinyItemResponse;
}

const getCharacterArmor = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
) => {
  const { itemSubType } = tableItem;

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return { helmet: item };
    case DestinyItemSubType.GauntletsArmor:
      return { gauntlets: item };
    case DestinyItemSubType.ChestArmor:
      return { chest: item };
    case DestinyItemSubType.LegArmor:
      return { legs: item };
    case DestinyItemSubType.ClassArmor:
      return { class: item };
    default:
      return null;
  }
};

const getCharacterWeapons = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
) => {
  const { itemCategoryHashes } = tableItem;

  if (!itemCategoryHashes) return null;

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.KineticWeapon))
    return { kinetic: item };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.EnergyWeapon))
    return { energy: item };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.PowerWeapon))
    return { power: item };

  return null;
};

export const createDestinyCharacterLoadout = (
  characterItems: DestinyItemResponse[],
  inventoryItemsTable: Record<number, DestinyInventoryItemDefinition>
) => {
  let loadout = {};

  for (const characterItem of characterItems) {
    const {
      item: { data },
    } = characterItem;

    if (data) {
      const { itemHash } = data;

      const tableItem = inventoryItemsTable[itemHash];

      if (tableItem) {
        const { itemType } = tableItem;

        switch (itemType) {
          case DestinyItemType.Armor:
            loadout = {
              ...loadout,
              ...getCharacterArmor(characterItem, tableItem),
            };
          case DestinyItemType.Weapon:
            loadout = {
              ...loadout,
              ...getCharacterWeapons(characterItem, tableItem),
            };
          case DestinyItemType.Subclass:
            loadout = { ...loadout, subclass: characterItem };
          default:
            continue;
        }
      }
    }
  }

  return loadout as Loadout;
};
