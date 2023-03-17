import { notFound } from "next/navigation";
import { getAuthSessionServer } from "@/core/auth/utils";
import { destinyClient } from "@/core/bungie-api/client";
import { CharacterClassIconBackground } from "@/core/components/destiny/CharacterClassIconBackground";
import { CharacterSelector } from "./CharacterSelector";

interface NewLoadoutLaoutProps {
  children: React.ReactNode;
}

export default async function NewLoadoutLaout({
  children,
}: NewLoadoutLaoutProps) {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  destinyClient.setAuthToken(session.accessToken);
  const data = await destinyClient.characters.getMyCharacters();

  return (
    <div className="flex flex-col space-y-4">
      <CharacterClassIconBackground characters={data.characters.data} />
      <CharacterSelector characters={data.characters.data} />
      {children}
    </div>
  );
}
