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
import { trpcClient } from "../trpc/client";
import { DestinyItemCategoryHash } from "./consants";
import { DestinyCharacterLoadout, LoadoutItem } from "./types";

type GetLoadoutItemReturnType = Record<string, LoadoutItem> | null;

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
  fetchHelper: (config: HttpClientConfig) => Promise<any>
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

  const inventoryItemHashes: string[] = [];

  for (const item of items) {
    if (item?.item?.data) {
      const { itemHash } = item.item.data;
      inventoryItemHashes.push(itemHash.toString());
    }
  }

  inventoryItemHashes.push(
    ...loadoutItems
      .map((item) => item.plugItemHashes.map((hash) => hash.toString()))
      .flat()
  );

  const inventoryItems =
    await trpcClient.destiny.manifest.latest.getTableComponents.query({
      tableName: "DestinyInventoryItemDefinition",
      locale: "en",
      hashIds: [...new Set(inventoryItemHashes)],
    });

  let loadout = {
    inventoryItems: inventoryItems.reduce((acc, item) => {
      const inventoryItem =
        item.content as unknown as DestinyInventoryItemDefinition;

      return { ...acc, [inventoryItem.hash]: inventoryItem };
    }, {}),
  };

  for (const loadoutItem of loadoutItems) {
    const { itemInstanceId } = loadoutItem;
    const itemInstance = items.find(
      (item) => item?.item?.data?.itemInstanceId === itemInstanceId
    );

    if (!itemInstance) continue;

    const { itemHash } = itemInstance.item.data!;

    const tableItem = loadout.inventoryItems[itemHash];

    if (!tableItem) continue;

    const { itemType } = tableItem;

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
        loadout = {
          ...loadout,
          subclass: [loadoutItem, itemInstance],
        };
      default:
        continue;
    }
  }

  return loadout as DestinyCharacterLoadout;
};
