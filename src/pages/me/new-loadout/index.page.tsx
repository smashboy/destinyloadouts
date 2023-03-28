import {
  DestinyComponentType,
  type DestinyLoadoutColorDefinition,
  type DestinyLoadoutComponent,
  type DestinyLoadoutIconDefinition,
  getProfile,
  type DestinyCharacterComponent,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { type GetServerSideProps, type NextPage } from "next";
import { useRouter } from "next/router";
import { bungieApiFetchHelper } from "~/bungie/fetchHelper";
import { getSingleMembershipData } from "~/bungie/getSingleMembershipData";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import { CharacterClassIconBackground } from "~/components/destiny/CharacterClassIconBackground";
import { getServerAuthSession } from "~/server/auth";
import { trpsSSG } from "~/utils/ssg";
import { CharacterSelector } from "./components/CharacterSelector";
import { LoadoutSelector } from "./components/LoadoutSelector";
import { createDestinyCharacterLoadout } from "~/bungie/createDestinyCharacterLoadout";
import { CharacterSockets } from "./components/CharacterSockets";

interface NewLoadoutPageProps {
  characters: Record<string, DestinyCharacterComponent>;
  loadouts: DestinyLoadoutComponent[];
  loadoutIcons: Record<string, DestinyLoadoutIconDefinition>;
  loadoutColors: Record<string, DestinyLoadoutColorDefinition>;
  selectedLoadout: DestinyCharacterLoadout | null;
}

const NewLoadoutPage: NextPage<NewLoadoutPageProps> = ({
  characters,
  loadouts,
  loadoutColors,
  loadoutIcons,
  selectedLoadout,
}) => {
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
};

export const getServerSideProps: GetServerSideProps<
  NewLoadoutPageProps
> = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { accessToken } = session;
  const { characterId, loadout: loadoutIndex } = ctx.query;

  const components = [DestinyComponentType.Characters];

  if (characterId) components.push(DestinyComponentType.CharacterLoadouts);

  const trpc = trpsSSG(session);
  const fetchHelper = bungieApiFetchHelper(accessToken);

  const destinyMembership = getSingleMembershipData(
    (await getMembershipDataForCurrentUser(fetchHelper)).Response
  );

  const { membershipId, membershipType } = destinyMembership;

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

  const characterLoadouts = (
    profileResponse.characterLoadouts?.data?.[characterId as string]
      ?.loadouts || []
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
      trpc.destiny.manifest.latest.getTableComponents.fetch({
        tableName: "DestinyLoadoutIconDefinition",
        locale: "en",
        hashIds: iconHashes,
      }),
      trpc.destiny.manifest.latest.getTableComponents.fetch({
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
      fetchHelper,
      trpc
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

export default NewLoadoutPage;
