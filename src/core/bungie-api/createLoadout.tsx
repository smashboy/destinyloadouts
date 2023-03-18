import {
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
} from "bungie-api-ts/destiny2";
import { DestinyItemCategoryHash } from "./consants";
import { DestinyCharacterLoadout } from "./types";

const getCharacterArmor = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
) => {
  const { itemSubType } = tableItem;

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return { helmet: [item, tableItem] };
    case DestinyItemSubType.GauntletsArmor:
      return { gauntlets: [item, tableItem] };
    case DestinyItemSubType.ChestArmor:
      return { chest: [item, tableItem] };
    case DestinyItemSubType.LegArmor:
      return { legs: [item, tableItem] };
    case DestinyItemSubType.ClassArmor:
      return { class: [item, tableItem] };
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
    return { kinetic: [item, tableItem] };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.EnergyWeapon))
    return { energy: [item, tableItem] };

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.PowerWeapon))
    return { power: [item, tableItem] };

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
              ...getCharacterArmor(characterItem, tableItem),
            };
          case DestinyItemType.Weapon:
            loadout = {
              ...loadout,
              ...getCharacterWeapons(characterItem, tableItem),
            };
          case DestinyItemType.Subclass:
            loadout = { ...loadout, subclass: [characterItem, tableItem] };
          default:
            continue;
        }
      }
    }
  }

  return loadout as DestinyCharacterLoadout;
};
