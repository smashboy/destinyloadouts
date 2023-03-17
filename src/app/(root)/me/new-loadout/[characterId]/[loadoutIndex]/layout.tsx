import { destinyClient } from "@/core/bungie-api/client";
import { DestinyContentLoadoutNameList } from "@/core/bungie-api/types";
import { CharacterSockets } from "./CharacterSockets";
import { LoadoutName } from "./LoadoutName";

interface SelectedLoadoutLayoutProps {
  children: React.ReactNode;
  params: { loadoutIndex: string };
}

export default async function SelectedLoadoutLayout({
  children,
  params: { loadoutIndex },
}: SelectedLoadoutLayoutProps) {
  const destinyManifest = await destinyClient.manifest.get();

  const contentPaths = destinyManifest.jsonWorldComponentContentPaths["en"];

  const loadoutNames =
    await destinyClient.manifest.getDestinyContentFromUrl<DestinyContentLoadoutNameList>(
      contentPaths.DestinyLoadoutNameDefinition
    );

  return (
    <div className="flex flex-col space-y-2">
      <LoadoutName loadoutIndex={loadoutIndex} loadoutNames={loadoutNames} />
      <CharacterSockets />
      {children}
    </div>
  );
}
