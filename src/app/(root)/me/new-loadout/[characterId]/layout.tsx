import { notFound } from "next/navigation";
import {
  getProfile,
  DestinyComponentType,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { LoadoutSelector } from "./LoadoutSelector";
import { LoadoutsContext } from "@/core/stores/LoadoutContext";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import { getSingleMembershipData } from "@/core/bungie-api/user";

interface CharacterLoadoutSelectorLayoutProps {
  children: React.ReactNode;
  params: { characterId: string };
}

export default async function CharacterLoadoutSelectorLayout({
  children,
  params: { characterId },
}: CharacterLoadoutSelectorLayoutProps) {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const destinyMembership = getSingleMembershipData(
    (await getMembershipDataForCurrentUser(fetchHelper)).Response
  );

  const [profile, destinyManifest] = await Promise.all([
    getProfile(fetchHelper, {
      components: [DestinyComponentType.CharacterLoadouts],
      destinyMembershipId: destinyMembership.membershipId,
      membershipType: destinyMembership.membershipType,
    }),
    getDestinyManifest(fetchHelper),
  ]);

  const loadouts =
    profile.Response.characterLoadouts.data?.[characterId].loadouts || [];

  const {
    DestinyLoadoutColorDefinition: loadoutColors,
    DestinyLoadoutIconDefinition: loadoutIcons,
  } = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: destinyManifest.Response,
    tableNames: [
      "DestinyLoadoutIconDefinition",
      "DestinyLoadoutColorDefinition",
    ],
    language: "en",
  });

  const filledLoadouts = loadouts.filter((loadout) =>
    loadout.items.every((item) => item.itemInstanceId !== "0")
  );

  return (
    <>
      <LoadoutSelector
        characterId={characterId}
        loadouts={filledLoadouts}
        loadoutIcons={loadoutIcons}
        loadoutColors={loadoutColors}
      />
      <LoadoutsContext value={filledLoadouts}>{children}</LoadoutsContext>
    </>
  );
}
