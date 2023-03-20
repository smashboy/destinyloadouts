import {
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
} from "bungie-api-ts/destiny2";
import { DestinyItemCategoryHash } from "./consants";
import {
  DestinyCharacterLoadout,
  LoadoutItem,
  LoadoutInventoryItemsList,
} from "./types";

type GetLoadoutItemReturnType =
  | [Record<string, LoadoutItem>, LoadoutInventoryItemsList]
  | null;

const getInitialInventoryItems = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition,
  inventoryItemsTable: LoadoutInventoryItemsList
) => {
  const {
    item: { data },
  } = item;
  const { itemHash } = data!;

  const overrideStyleItemHash = item.item.data?.overrideStyleItemHash;

  return {
    [itemHash]: tableItem,
    ...(overrideStyleItemHash && {
      [overrideStyleItemHash]: inventoryItemsTable[overrideStyleItemHash],
    }),
  };
};

const getCharacterArmor = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition,
  inventoryItemsTable: LoadoutInventoryItemsList
): GetLoadoutItemReturnType => {
  const { itemSubType } = tableItem;

  const socketItems = item.sockets?.data?.sockets || [];

  const inventoryItems = getInitialInventoryItems(
    item,
    tableItem,
    inventoryItemsTable
  );

  for (const socketItem of socketItems) {
    const { isEnabled, isVisible, plugHash } = socketItem;
    if (isEnabled && isVisible && plugHash)
      inventoryItems[plugHash] = inventoryItemsTable[plugHash];
  }

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return [{ helmet: item }, inventoryItems];
    case DestinyItemSubType.GauntletsArmor:
      return [{ gauntlets: item }, inventoryItems];
    case DestinyItemSubType.ChestArmor:
      return [{ chest: item }, inventoryItems];
    case DestinyItemSubType.LegArmor:
      return [{ legs: item }, inventoryItems];
    case DestinyItemSubType.ClassArmor:
      return [{ class: item }, inventoryItems];
    default:
      return null;
  }
};

const getCharacterWeapons = (
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition,
  inventoryItemsTable: LoadoutInventoryItemsList
): GetLoadoutItemReturnType => {
  const { itemCategoryHashes } = tableItem;

  if (!itemCategoryHashes) return null;

  const inventoryItems = getInitialInventoryItems(
    item,
    tableItem,
    inventoryItemsTable
  );

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.KineticWeapon))
    return [{ kinetic: item }, inventoryItems];

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.EnergyWeapon))
    return [{ energy: item }, inventoryItems];

  if (itemCategoryHashes.includes(DestinyItemCategoryHash.PowerWeapon))
    return [{ power: item }, inventoryItems];

  return null;
};

export const createDestinyCharacterLoadout = (
  characterItems: DestinyItemResponse[],
  inventoryItemsTable: LoadoutInventoryItemsList
) => {
  let loadout = {
    inventoryItems: {},
  };

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
          case DestinyItemType.Armor: {
            const characterArmor = getCharacterArmor(
              characterItem,
              tableItem,
              inventoryItemsTable
            );

            if (!characterArmor) continue;

            const [armor, inventoryItems] = characterArmor;

            const { inventoryItems: prevInventoryItems } = loadout;

            loadout = {
              ...loadout,
              ...armor,
              inventoryItems: { ...prevInventoryItems, ...inventoryItems },
            };
          }
          case DestinyItemType.Weapon: {
            const characterWeapons = getCharacterWeapons(
              characterItem,
              tableItem,
              inventoryItemsTable
            );

            if (!characterWeapons) continue;

            const [weapons, inventoryItems] = characterWeapons;
            const { inventoryItems: prevInventoryItems } = loadout;

            loadout = {
              ...loadout,
              ...weapons,
              inventoryItems: { ...prevInventoryItems, ...inventoryItems },
            };
          }
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
