import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  DestinyCharacterComponent,
  DestinyComponentType,
  DestinyLoadoutColorDefinition,
  DestinyLoadoutComponent,
  DestinyLoadoutIconDefinition,
  getProfile,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getAuthSessionServer } from "@/core/auth/utils";
import { bungieApiFetchHelper } from "@destiny/shared/fetchHelper";
import { getSingleMembershipData } from "@/core/bungie-api/user";
import { CharacterSelector } from "./components/CharacterSelector";
import { CharacterClassIconBackground } from "@/core/components/destiny/CharacterClassIconBackground";
import { LoadoutSelector } from "./components/LoadoutSelector";
import { trpcClient } from "@/core/trpc/client";
import { DestinyCharacterLoadout } from "@destiny/shared/types";
import { createDestinyCharacterLoadout } from "@/core/bungie-api/createLoadout";
import { CharacterSockets } from "./components/CharacterSockets";

interface NewLoadoutPageProps {
  characters: Record<string, DestinyCharacterComponent>;
  loadouts: DestinyLoadoutComponent[];
  loadoutIcons: Record<string, DestinyLoadoutIconDefinition>;
  loadoutColors: Record<string, DestinyLoadoutColorDefinition>;
  selectedLoadout: DestinyCharacterLoadout | null;
}

export default function NewLoadoutPage({
  characters,
  loadouts,
  loadoutColors,
  loadoutIcons,
  selectedLoadout,
}: NewLoadoutPageProps) {
  const router = useRouter();

  const { characterId } = router.query;

  return (
    <div className="flex flex-col space-y-4">
      <CharacterClassIconBackground
        characters={characters}
        selecetedCharacterId={characterId as string}
      />
      <CharacterSelector characters={characters} />
      {loadouts.length > 0 && characterId && (
        <LoadoutSelector
          characterId={characterId as string}
          loadouts={loadouts}
          loadoutIcons={loadoutIcons}
          loadoutColors={loadoutColors}
        />
      )}
      {selectedLoadout && (
        <div className="flex flex-col space-y-2">
          <CharacterSockets loadout={selectedLoadout} />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  NewLoadoutPageProps
> = async (ctx) => {
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

  const session = await getAuthSessionServer(ctx);

  const { characterId, loadout: loadoutIndex } = ctx.query;

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const fetchHelper = bungieApiFetchHelper(session.accessToken);

  const destinyMembership = getSingleMembershipData(
    (await getMembershipDataForCurrentUser(fetchHelper)).Response
  );

  const { membershipId, membershipType } = destinyMembership;

  const components = [DestinyComponentType.Characters];

  if (characterId) components.push(DestinyComponentType.CharacterLoadouts);

  const profile = await getProfile(fetchHelper, {
    components,
    destinyMembershipId: membershipId,
    membershipType: membershipType,
  });

  const profileResponse = profile.Response;

  const characters = profileResponse.characters.data || {};
  const loadouts: DestinyLoadoutComponent[] = [];
  const loadoutIcons: Record<string, DestinyLoadoutIconDefinition> = {};
  const loadoutColors: Record<string, DestinyLoadoutColorDefinition> = {};

  const loadoutsData = profileResponse.characterLoadouts?.data;
  const characterLoadouts = (
    loadoutsData?.[characterId as string]?.loadouts || []
  ).filter((loadout) =>
    loadout.items.every((item) => item.itemInstanceId !== "0")
  );

  if (characterLoadouts.length > 0) {
    const iconHashes = [
      ...new Set(
        characterLoadouts.map((loadout) => loadout.iconHash.toString())
      ),
    ];
    const colorHashes = [
      ...new Set(
        characterLoadouts.map((loadout) => loadout.colorHash.toString())
      ),
    ];

    const [icons, colors] = await Promise.all([
      trpcClient.destiny.manifest.latest.getTableComponents.query({
        tableName: "DestinyLoadoutIconDefinition",
        locale: "en",
        hashIds: iconHashes,
      }),
      trpcClient.destiny.manifest.latest.getTableComponents.query({
        tableName: "DestinyLoadoutColorDefinition",
        locale: "en",
        hashIds: colorHashes,
      }),
    ]);

    loadouts.push(...characterLoadouts);

    for (const icon of icons) {
      loadoutIcons[icon.hashId] =
        icon.content as unknown as DestinyLoadoutIconDefinition;
    }

    for (const color of colors) {
      loadoutColors[color.hashId] =
        color.content as unknown as DestinyLoadoutColorDefinition;
    }
  }

  let selectedLoadout: DestinyCharacterLoadout | null = null;

  const loadout = loadouts[loadoutIndex as unknown as number];

  if (loadout) {
    selectedLoadout = await createDestinyCharacterLoadout(
      loadout,
      membershipId,
      membershipType,
      fetchHelper
    );
  }

  return {
    props: {
      characters,
      loadouts,
      loadoutIcons,
      loadoutColors,
      selectedLoadout,
    },
  };
};
