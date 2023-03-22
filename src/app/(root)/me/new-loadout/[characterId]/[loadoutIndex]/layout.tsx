import { notFound } from "next/navigation";
import {
  DestinyComponentType,
  DestinyItemType,
  DestinyInventoryItemDefinition,
  DestinyLoadoutNameDefinition,
  getProfile,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";

import { getSingleMembershipData } from "@/core/bungie-api/user";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { trpcClient } from "@/core/trpc/client";
import { TypographyLarge } from "@/core/components/typography";

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

  const loadoutNameComponent =
    await trpcClient.destiny.manifest.latest.getTableComponent.query({
      tableName: "DestinyLoadoutNameDefinition",
      hashId: selectedLoadout.nameHash.toString(),
      locale: "en",
    });

  // const loadout = await createDestinyCharacterLoadout(
  //   selectedLoadout,
  //   membershipId,
  //   membershipType,
  //   fetchHelper,
  //   inventoryItems
  // );

  const itemsTest =
    await trpcClient.destiny.manifest.latest.getTableComponents.query({
      tableName: "DestinyInventoryItemDefinition",
      locale: "en",
      hashIds: selectedLoadout.items
        .map((item) => item.plugItemHashes.map((hash) => hash.toString()))
        .flat(),
    });

  return (
    <div className="flex flex-col space-y-2">
      <ConsoleLog
        loadoutNameComponent={loadoutNameComponent}
        itemsTest={itemsTest.filter(
          (item) =>
            (item.content as unknown as DestinyInventoryItemDefinition)
              .itemType === DestinyItemType.Armor
        )}
      />
      {loadoutNameComponent && (
        <TypographyLarge>
          {
            (
              loadoutNameComponent.content as unknown as DestinyLoadoutNameDefinition
            ).name
          }
        </TypographyLarge>
      )}
      {/* <CharacterSockets loadout={loadout} /> */}
      {children}
    </div>
  );
}
