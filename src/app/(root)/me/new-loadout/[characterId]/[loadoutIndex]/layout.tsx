import { notFound } from "next/navigation";
import {
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { getAuthSessionServer } from "@/core/auth/utils";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import { CharacterSockets } from "./CharacterSockets";
import { LoadoutName } from "./LoadoutName";

interface SelectedLoadoutLayoutProps {
  children: React.ReactNode;
  params: { loadoutIndex: string; characterId: string };
}

export default async function SelectedLoadoutLayout({
  children,
  params: { loadoutIndex },
}: SelectedLoadoutLayoutProps) {
  const session = await getAuthSessionServer();

  if (!session) return notFound();

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const destinyManifest = await getDestinyManifest(fetchHelper);

  const { DestinyLoadoutNameDefinition: loadoutNames } =
    await getDestinyManifestSlice(fetchHelper, {
      destinyManifest: destinyManifest.Response,
      tableNames: ["DestinyLoadoutNameDefinition"],
      language: "en",
    });

  return (
    <div className="flex flex-col space-y-2">
      {/* <ConsoleLog loadoutItems={loadoutItems} /> */}
      <LoadoutName loadoutIndex={loadoutIndex} loadoutNames={loadoutNames} />
      <CharacterSockets />
      {children}
    </div>
  );
}
