import {
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
} from "bungie-api-ts/destiny2";
import { DestinyItemCategoryHash } from "./consants";
import { DestinyCharacterLoadout, LoadoutItem } from "./types";

const getCharacterArmor = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition,
  inventoryItemsTable: Record<number, DestinyInventoryItemDefinition>
): Record<string, LoadoutItem> | null => {
  const { itemSubType } = tableItem;

  const overrideStyleItemHash = item.item.data?.overrideStyleItemHash;

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return {
        helmet: {
          item,
          inventoryItem: tableItem,
          overrideStyleInventoryItem:
            (overrideStyleItemHash &&
              inventoryItemsTable[overrideStyleItemHash]) ||
            null,
        },
      };
    case DestinyItemSubType.GauntletsArmor:
      return {
        gauntlets: {
          item,
          inventoryItem: tableItem,
          overrideStyleInventoryItem:
            (overrideStyleItemHash &&
              inventoryItemsTable[overrideStyleItemHash]) ||
            null,
        },
      };
    case DestinyItemSubType.ChestArmor:
      return {
        chest: {
          item,
          inventoryItem: tableItem,
          overrideStyleInventoryItem:
            (overrideStyleItemHash &&
              inventoryItemsTable[overrideStyleItemHash]) ||
            null,
        },
      };
    case DestinyItemSubType.LegArmor:
      return {
        legs: {
          item,
          inventoryItem: tableItem,
          overrideStyleInventoryItem:
            (overrideStyleItemHash &&
              inventoryItemsTable[overrideStyleItemHash]) ||
            null,
        },
      };
    case DestinyItemSubType.ClassArmor:
      return {
        class: {
          item,
          inventoryItem: tableItem,
          overrideStyleInventoryItem:
            (overrideStyleItemHash &&
              inventoryItemsTable[overrideStyleItemHash]) ||
            null,
        },
      };
    default:
      return null;
  }
};

const getCharacterWeapons = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition,
  inventoryItemsTable: Record<number, DestinyInventoryItemDefinition>
): Record<string, LoadoutItem> | null => {
  const { itemCategoryHashes } = tableItem;

  if (!itemCategoryHashes) return null;

  const overrideStyleItemHash = item.item.data?.overrideStyleItemHash;

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.KineticWeapon))
    return {
      kinetic: {
        item,
        inventoryItem: tableItem,
        overrideStyleInventoryItem:
          (overrideStyleItemHash &&
            inventoryItemsTable[overrideStyleItemHash]) ||
          null,
      },
    };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.EnergyWeapon))
    return {
      energy: {
        item,
        inventoryItem: tableItem,
        overrideStyleInventoryItem:
          (overrideStyleItemHash &&
            inventoryItemsTable[overrideStyleItemHash]) ||
          null,
      },
    };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.PowerWeapon))
    return {
      power: {
        item,
        inventoryItem: tableItem,
        overrideStyleInventoryItem:
          (overrideStyleItemHash &&
            inventoryItemsTable[overrideStyleItemHash]) ||
          null,
      },
    };

  return null;
};

export const createDestinyCharacterLoadout = (
  characterItems: DestinyItemResponse[],
  inventoryItemsTable: Record<number, DestinyInventoryItemDefinition>
) => {
  let loadout = {};

  for (const characterItem of characterItems) {
    if (!characterItem) continue;

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
              ...getCharacterArmor(
                characterItem,
                tableItem,
                inventoryItemsTable
              ),
            };
          case DestinyItemType.Weapon:
            loadout = {
              ...loadout,
              ...getCharacterWeapons(
                characterItem,
                tableItem,
                inventoryItemsTable
              ),
            };
          case DestinyItemType.Subclass:
            loadout = { ...loadout, subclass: characterItem };
          default:
            continue;
        }
      }
    }
  }

  return loadout as DestinyCharacterLoadout;
};
