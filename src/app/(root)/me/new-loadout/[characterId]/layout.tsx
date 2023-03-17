import { notFound } from "next/navigation";
import { getAuthSessionServer } from "@/core/auth/utils";
import { destinyClient } from "@/core/bungie-api/client";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { LoadoutSelector } from "./LoadoutSelector";
import {
  DestinyContentLoadoutColorList,
  DestinyContentLoadoutIconList,
} from "@/core/bungie-api/types";

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

  destinyClient.setAuthToken(session.accessToken);
  const [loadoutsData, destinyManifest] = await Promise.all([
    destinyClient.characters.getLoadouts(characterId),
    destinyClient.manifest.get(),
  ]);

  const contentPaths = destinyManifest.jsonWorldComponentContentPaths["en"];

  const [loadoutIcons, loadoutColors] = await Promise.all([
    destinyClient.manifest.getDestinyContentFromUrl<DestinyContentLoadoutIconList>(
      contentPaths.DestinyLoadoutIconDefinition
    ),
    destinyClient.manifest.getDestinyContentFromUrl<DestinyContentLoadoutColorList>(
      contentPaths.DestinyLoadoutColorDefinition
    ),
    // destinyClient.manifest.getDestinyContentFromUrl<DestinyContentLoadoutNameList>(
    //   contentPaths.DestinyLoadoutNameDefinition
    // ),
  ]);

  const characterLoadouts = loadoutsData.characterLoadouts.data[characterId];

  if (!characterLoadouts) return notFound();

  const filledLoadouts = characterLoadouts.loadouts.filter((loadout) =>
    loadout.items.every((item) => item.itemInstanceId !== "0")
  );

  return (
    <>
      <ConsoleLog filledLoadouts={filledLoadouts} />
      <LoadoutSelector
        characterId={characterId}
        loadouts={filledLoadouts}
        loadoutIcons={loadoutIcons}
        loadoutColors={loadoutColors}
      />
      {children}
    </>
  );
}
