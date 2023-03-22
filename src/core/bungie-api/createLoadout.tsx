import {
  BungieMembershipType,
  DestinyInventoryItemDefinition,
  DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
  DestinyComponentType,
  DestinyLoadoutComponent,
  DestinyLoadoutItemComponent,
  getItem,
  HttpClientConfig,
} from "bungie-api-ts/destiny2";
import { DestinyItemCategoryHash } from "./consants";
import {
  DestinyCharacterLoadout,
  LoadoutItem,
  LoadoutInventoryItemsList,
} from "./types";

type GetLoadoutItemReturnType = Record<string, LoadoutItem> | null;

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
  loadoutItem: DestinyLoadoutItemComponent,
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
): GetLoadoutItemReturnType => {
  const { itemSubType } = tableItem;

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return { helmet: [loadoutItem, item] };
    case DestinyItemSubType.GauntletsArmor:
      return { gauntlets: [loadoutItem, item] };
    case DestinyItemSubType.ChestArmor:
      return { chest: [loadoutItem, item] };
    case DestinyItemSubType.LegArmor:
      return { legs: [loadoutItem, item] };
    case DestinyItemSubType.ClassArmor:
      return { class: [loadoutItem, item] };
    default:
      return null;
  }
};

const getCharacterWeapons = (
  loadoutItem: DestinyLoadoutItemComponent,
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
): GetLoadoutItemReturnType => {
  const { itemCategoryHashes } = tableItem;

  if (itemCategoryHashes?.includes(DestinyItemCategoryHash.KineticWeapon))
    return { kinetic: [loadoutItem, item] };

  if (itemCategoryHashes?.includes(DestinyItemCategoryHash.EnergyWeapon))
    return { energy: [loadoutItem, item] };

  if (itemCategoryHashes?.includes(DestinyItemCategoryHash.PowerWeapon))
    return { power: [loadoutItem, item] };

  return null;
};

export const createDestinyCharacterLoadout = async (
  loadoutData: DestinyLoadoutComponent,
  membershipId: string,
  membershipType: BungieMembershipType,
  fetchHelper: (config: HttpClientConfig) => Promise<any>,
  inventoryTable: LoadoutInventoryItemsList
): Promise<DestinyCharacterLoadout> => {
  const { items: loadoutItems } = loadoutData;

  const items = (
    await Promise.all(
      loadoutItems.map(({ itemInstanceId }) =>
        getItem(fetchHelper, {
          membershipType,
          itemInstanceId,
          components: [
            DestinyComponentType.ItemInstances,
            DestinyComponentType.ItemCommonData,
            // DestinyComponentType.ItemSockets,
            // DestinyComponentType.ItemStats,
          ],
          destinyMembershipId: membershipId,
        })
      )
    )
  ).map((res) => res.Response);

  let loadout = {
    inventoryItems: {},
  };

  for (const loadoutItem of loadoutItems) {
    const { itemInstanceId, plugItemHashes } = loadoutItem;
    const itemInstance = items.find(
      (item) => item?.item?.data?.itemInstanceId === itemInstanceId
    );

    if (!itemInstance) continue;

    const { itemHash } = itemInstance.item.data!;

    const tableItem = inventoryTable[itemHash];

    if (!tableItem) continue;

    const { itemType } = tableItem;

    loadout.inventoryItems[tableItem.hash] = tableItem;

    for (const hash of plugItemHashes) {
      // const { isEnabled, isVisible, plugHash } = socketItem;
      // if (isEnabled && isVisible && plugHash)

      loadout.inventoryItems[hash] = inventoryTable[hash];
    }

    switch (itemType) {
      case DestinyItemType.Armor:
        loadout = {
          ...loadout,
          ...getCharacterArmor(loadoutItem, itemInstance, tableItem),
        };
      case DestinyItemType.Weapon:
        loadout = {
          ...loadout,
          ...getCharacterWeapons(loadoutItem, itemInstance, tableItem),
        };
      case DestinyItemType.Subclass:
        continue;
      default:
        continue;
    }
  }

  return loadout as DestinyCharacterLoadout;
};
