import { getAuthSessionServer } from "@/core/auth/utils";
import { destinyClient } from "@/core/bungie-api/client";
import { DestinyCharacterClassIconBackground } from "@/core/components/DestinyCharacterClassIconBackground";
import { notFound } from "next/navigation";
import { CharacterSelector } from "./CharacterSelector";

export default async function NewLoadoutPage() {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  destinyClient.setAuthToken(session.accessToken);
  const data = await destinyClient.characters.getMyCharacters();

  return (
    <div className="flex flex-col space-y-4">
      <DestinyCharacterClassIconBackground />
      <CharacterSelector characters={data.characters.data} />
    </div>
  );
}
