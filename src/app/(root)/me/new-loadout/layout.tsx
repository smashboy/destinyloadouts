import { notFound } from "next/navigation";
import { getProfile, DestinyComponentType } from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { CharacterClassIconBackground } from "@/core/components/destiny/CharacterClassIconBackground";
import { CharacterSelector } from "./CharacterSelector";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import { getSingleMembershipData } from "@/core/bungie-api/user";

interface NewLoadoutLaoutProps {
  children: React.ReactNode;
}

export default async function NewLoadoutLaout({
  children,
}: NewLoadoutLaoutProps) {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const destinyMembership = getSingleMembershipData(
    (await getMembershipDataForCurrentUser(fetchHelper)).Response
  );

  const profile = await getProfile(fetchHelper, {
    components: [DestinyComponentType.Characters],
    destinyMembershipId: destinyMembership.membershipId,
    membershipType: destinyMembership.membershipType,
  });

  const characters = profile.Response.characters.data || {};

  return (
    <div className="flex flex-col space-y-4">
      <CharacterClassIconBackground characters={characters} />
      <CharacterSelector characters={characters} />
      {children}
    </div>
  );
}
