import {
  type BungieMembershipType,
  type DestinyInventoryItemDefinition,
  type DestinyItemResponse,
  DestinyItemSubType,
  DestinyItemType,
  DestinyComponentType,
  type DestinyLoadoutComponent,
  type DestinyLoadoutItemComponent,
  type DestinyItemSocketState,
  getItem,
  type HttpClientConfig,
} from "bungie-api-ts/destiny2";
import { type TrpcSSG } from "~/utils/ssg";
import { type DestinyCharacterLoadout, type LoadoutItem } from "./types";
import { DestinyItemCategoryHash } from "./constants";

type GetLoadoutItemReturnType = Record<string, LoadoutItem> | null;

const getSocketHash = (
  loadoutItem: DestinyLoadoutItemComponent,
  sockets: DestinyItemSocketState[],
  isArmor?: boolean
) => {
  const hashes = [...loadoutItem.plugItemHashes];

  for (const socket of sockets) {
    const { plugHash } = socket;

    if (plugHash && !hashes.includes(plugHash) && !isArmor)
      hashes.push(plugHash);
  }

  return hashes;
};

const getCharacterArmor = (
  loadoutItem: DestinyLoadoutItemComponent,
  item: DestinyItemResponse,
  tableItem: DestinyInventoryItemDefinition
): GetLoadoutItemReturnType => {
  const { itemSubType } = tableItem;

  switch (itemSubType) {
    case DestinyItemSubType.HelmetArmor:
      return {
        helmet: [
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.item.data!.itemHash,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          getSocketHash(loadoutItem, item.sockets.data!.sockets, true),
        ],
      };
    case DestinyItemSubType.GauntletsArmor:
      return {
        gauntlets: [
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.item.data!.itemHash,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          getSocketHash(loadoutItem, item.sockets.data!.sockets, true),
        ],
      };
    case DestinyItemSubType.ChestArmor:
      return {
        chest: [
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.item.data!.itemHash,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          getSocketHash(loadoutItem, item.sockets.data!.sockets, true),
        ],
      };
    case DestinyItemSubType.LegArmor:
      return {
        legs: [
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.item.data!.itemHash,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          getSocketHash(loadoutItem, item.sockets.data!.sockets, true),
        ],
      };
    case DestinyItemSubType.ClassArmor:
      return {
        class: [
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          item.item.data!.itemHash,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          getSocketHash(loadoutItem, item.sockets.data!.sockets, true),
        ],
      };
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
    return {
      kinetic: [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item.item.data!.itemHash,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getSocketHash(loadoutItem, item.sockets.data!.sockets),
      ],
    };

  if (itemCategoryHashes?.includes(DestinyItemCategoryHash.EnergyWeapon))
    return {
      energy: [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item.item.data!.itemHash,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getSocketHash(loadoutItem, item.sockets.data!.sockets),
      ],
    };

  if (itemCategoryHashes?.includes(DestinyItemCategoryHash.PowerWeapon))
    return {
      power: [
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        item.item.data!.itemHash,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        getSocketHash(loadoutItem, item.sockets.data!.sockets),
      ],
    };

  return null;
};

export const createDestinyCharacterLoadout = async (
  loadoutData: DestinyLoadoutComponent,
  membershipId: string,
  membershipType: BungieMembershipType,
  fetchHelper: (config: HttpClientConfig) => Promise<unknown>,
  trpc: TrpcSSG
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
            DestinyComponentType.ItemSockets,
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

    if (item?.sockets?.data) {
      const sockets = item.sockets.data.sockets;
      for (const socket of sockets) {
        const { plugHash } = socket;
        if (plugHash) inventoryItemHashes.push(plugHash.toString());
      }
    }
  }

  inventoryItemHashes.push(
    ...loadoutItems
      .map((item) => item.plugItemHashes.map((hash) => hash.toString()))
      .flat()
  );

  const inventoryItems =
    await trpc.destiny.manifest.latest.getTableComponents.fetch({
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          subclass: [
            itemHash,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            getSocketHash(loadoutItem, itemInstance.sockets!.data!.sockets),
          ],
        };
      default:
        continue;
    }
  }

  return loadout as DestinyCharacterLoadout;
};
