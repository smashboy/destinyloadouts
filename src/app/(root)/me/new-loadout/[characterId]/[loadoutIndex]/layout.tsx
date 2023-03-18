import { notFound } from "next/navigation";
import {
  DestinyComponentType,
  getItem,
  getProfile,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import { CharacterSockets } from "./CharacterSockets";
import { LoadoutName } from "./LoadoutName";
import { getSingleMembershipData } from "@/core/bungie-api/user";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { getDestinyManifestTables } from "@/core/bungie-api/getManifestTables";
import { createDestinyCharacterLoadout } from "@/core/bungie-api/createLoadout";

interface SelectedLoadoutLayoutProps {
  children: React.ReactNode;
  params: { loadoutIndex: string; characterId: string };
}

export default async function SelectedLoadoutLayout({
  children,
  params: { loadoutIndex, characterId },
}: SelectedLoadoutLayoutProps) {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const { membershipId, membershipType } = getSingleMembershipData(
    (await getMembershipDataForCurrentUser(fetchHelper)).Response
  );

  const profile = await getProfile(fetchHelper, {
    components: [DestinyComponentType.CharacterLoadouts],
    destinyMembershipId: membershipId,
    membershipType: membershipType,
  });

  const loadouts =
    profile.Response.characterLoadouts.data?.[characterId].loadouts || [];

  const filledLoadouts = loadouts.filter((loadout) =>
    loadout.items.every((item) => item.itemInstanceId !== "0")
  );

  const selectedLoadout = filledLoadouts[loadoutIndex as unknown as number];

  const loadoutItems = (
    await Promise.all(
      selectedLoadout.items.map(({ itemInstanceId }) =>
        getItem(fetchHelper, {
          membershipType,
          itemInstanceId,
          components: [
            DestinyComponentType.ItemInstances,
            DestinyComponentType.ItemCommonData,
            DestinyComponentType.ItemStats,
            DestinyComponentType.ItemSockets,
            DestinyComponentType.ItemPerks,
            DestinyComponentType.ItemReusablePlugs,
          ],
          destinyMembershipId: membershipId,
        })
      )
    )
  ).map((res) => res.Response);

  const {
    DestinyLoadoutNameDefinition: loadoutNames,
    DestinyInventoryItemDefinition: inventoryItems,
  } = await getDestinyManifestTables([
    "DestinyLoadoutNameDefinition",
    "DestinyInventoryItemDefinition",
  ]);

  const loadout = createDestinyCharacterLoadout(loadoutItems, inventoryItems);

  return (
    <div className="flex flex-col space-y-2">
      <ConsoleLog
        loadoutItems={loadoutItems}
        loadout={loadout}
        wtfAreu={inventoryItems[2357297366]}
      />
      <LoadoutName loadoutIndex={loadoutIndex} loadoutNames={loadoutNames} />
      <CharacterSockets loadout={loadout} />
      {children}
    </div>
  );
}
