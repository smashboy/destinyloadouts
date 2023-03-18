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

  const loadout = filledLoadouts[loadoutIndex as unknown as number];

  const loadoutItems = (
    await Promise.all(
      loadout.items.map(({ itemInstanceId }) =>
        getItem(fetchHelper, {
          membershipType,
          itemInstanceId,
          components: [DestinyComponentType.ItemInstances],
          destinyMembershipId: membershipId,
        })
      )
    )
  ).map((res) => res.Response);

  // const plugItems = await Promise.all(loadout.items.map(item => item.plugItemHashes).flat().map(itemId =>  getItem(fetchHelper, {
  //   membershipType,
  //   itemInstanceId: itemId,
  //   components: [DestinyComponentType.ItemInstances],
  //   destinyMembershipId: membershipId,
  // })))

  const { DestinyLoadoutNameDefinition: loadoutNames } =
    await getDestinyManifestTables(["DestinyLoadoutNameDefinition"]);

  return (
    <div className="flex flex-col space-y-2">
      <ConsoleLog loadout={loadout} loadoutItems={loadoutItems} />
      <LoadoutName loadoutIndex={loadoutIndex} loadoutNames={loadoutNames} />
      <CharacterSockets />
      {children}
    </div>
  );
}
