import { type NextPage, type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import {
  type DestinyLoadoutColorDefinition,
  type DestinyLoadoutComponent,
  type DestinyLoadoutIconDefinition,
  getProfile,
  type DestinyCharacterComponent,
} from "bungie-api-ts/destiny2";
import { getMembershipDataForCurrentUser } from "bungie-api-ts/user";
import { getServerAuthSession } from "~/server/auth";
import { trpcNext, type RouterOutputs } from "~/utils/api";
import { trpsSSG } from "~/utils/ssg";
import {
  LoadoutInfoForm,
  type LoadoutInfoFormValues,
} from "../new-loadout/components/LoadoutInfoForm";
import { CharacterSockets } from "~/components/loadouts/CharacterSockets";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import { bungieApiFetchHelper } from "~/bungie/fetchHelper";
import {
  DestinyComponentType,
  type DestinyComponentTypeConst,
} from "~/bungie/__generated";
import { getSingleMembershipData } from "~/bungie/getSingleMembershipData";
import { CharacterSelector } from "../new-loadout/components/CharacterSelector";
import { LoadoutSelector } from "../new-loadout/components/LoadoutSelector";
import { ButtonLink } from "~/components/Button";
import { createDestinyCharacterLoadout } from "~/bungie/createDestinyCharacterLoadout";
import {
  bungieDamageTypeToDbDamageTypeMap,
  bungieDestinyClassToDbCharacterClassMap,
} from "~/constants/loadouts";
import { Seo } from "~/components/Seo";

type EditLoadoutPageProps = NonNullable<
  RouterOutputs["loadouts"]["getById"]
> & {
  characters: Record<string, DestinyCharacterComponent>;
  loadouts: DestinyLoadoutComponent[];
  loadoutIcons: Record<string, DestinyLoadoutIconDefinition>;
  loadoutColors: Record<string, DestinyLoadoutColorDefinition>;
  selectedLoadout: DestinyCharacterLoadout | null;
};

const EditLoadoutPage: NextPage<EditLoadoutPageProps> = ({
  loadout,
  loadouts,
  inventoryItems,
  characters,
  loadoutIcons,
  loadoutColors,
  selectedLoadout,
}) => {
  const {
    name,
    tags,
    description,
    classType,
    subclassType,
    id: loadoutId,
  } = loadout;

  const router = useRouter();

  const { characterId, newLoadout } = router.query;

  const basePath = `/${loadoutId}/edit`;

  const updatedLoadout = selectedLoadout ?? {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    ...loadout.items,
    inventoryItems,
  };

  const updateLoadoutMutation = trpcNext.loadouts.update.useMutation({
    onSuccess: () =>
      router.push({
        pathname: "/[loadoutId]",
        query: {
          loadoutId,
        },
      }),
  });

  const handleUpdateLoadout = (formArgs: LoadoutInfoFormValues) => {
    const selectedCharacter = characters[characterId as string];

    const { inventoryItems, subclass, ...loadoutProps } = updatedLoadout;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [subclassHash] = subclass!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subclassItem = inventoryItems[subclassHash]!;

    let updatedClassType = classType;
    let updatedSubClassType = subclassType;

    if (selectedCharacter) {
      updatedClassType =
        bungieDestinyClassToDbCharacterClassMap[
          selectedCharacter.classType as keyof typeof bungieDestinyClassToDbCharacterClassMap
        ];

      updatedSubClassType =
        bungieDamageTypeToDbDamageTypeMap[
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subclassItem.talentGrid!
            .hudDamageType as keyof typeof bungieDamageTypeToDbDamageTypeMap
        ];
    }

    updateLoadoutMutation.mutate({
      loadoutId,
      loadout: {
        ...formArgs,
        items: { ...loadoutProps, subclass },
        classType: updatedClassType,
        subclassType: updatedSubClassType,
      },
    });
  };

  return (
    <>
      <Seo
        title="Edit loadout"
        description="Edit selected loadout."
        noindex
        nofollow
      />
      <div className="flex flex-col space-y-4">
        {Object.keys(characters).length > 0 && (
          <CharacterSelector characters={characters} basePath={basePath} />
        )}
        {loadouts.length > 0 && characterId && (
          <LoadoutSelector
            characterId={characterId as string}
            loadouts={loadouts}
            loadoutIcons={loadoutIcons}
            loadoutColors={loadoutColors}
            basePath={basePath}
          />
        )}
        <div className="grid grid-cols-5 gap-10">
          <div className="col-span-2">
            <LoadoutInfoForm
              onSubmit={handleUpdateLoadout}
              isLoading={updateLoadoutMutation.isLoading}
              initialValues={{
                name,
                tags: tags.map(({ tag }) => tag),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                description,
              }}
            />
          </div>
          <div className="col-span-3 flex flex-col items-end space-y-2">
            {newLoadout ? (
              <ButtonLink
                href={`/${loadoutId}/edit`}
                variant="subtle"
                className="w-fit"
              >
                Cancel
              </ButtonLink>
            ) : (
              <ButtonLink
                href={`/${loadoutId}/edit?newLoadout=true`}
                variant="subtle"
                className="w-fit"
              >
                Replace loadout
              </ButtonLink>
            )}
            <CharacterSockets loadout={updatedLoadout} />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  EditLoadoutPageProps
> = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const {
    characterId,
    loadout: loadoutIndex,
    loadoutId,
    newLoadout,
  } = ctx.query as {
    loadoutId: string;
    newLoadout: string | undefined;
    loadout: string | undefined;
    characterId: string | undefined;
  };

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { accessToken } = session;

  const trpc = trpsSSG(session);

  const canEdit = await trpc.loadouts.canEdit.fetch({ loadoutId });

  if (!canEdit)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const loadout = await trpc.loadouts.getById.fetch({ loadoutId });

  if (!loadout)
    return {
      notFound: true,
    };

  let characters: Record<string, DestinyCharacterComponent> = {};
  const loadouts: DestinyLoadoutComponent[] = [];
  const loadoutIcons: Record<string, DestinyLoadoutIconDefinition> = {};
  const loadoutColors: Record<string, DestinyLoadoutColorDefinition> = {};
  let selectedLoadout: DestinyCharacterLoadout | null = null;

  if (newLoadout) {
    const components: DestinyComponentTypeConst[keyof DestinyComponentTypeConst][] =
      [DestinyComponentType.Characters];

    if (characterId) components.push(DestinyComponentType.CharacterLoadouts);

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

    characters = profileResponse.characters.data || {};

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
  }

  return {
    props: {
      ...loadout,
      characters,
      loadouts,
      loadoutIcons,
      loadoutColors,
      selectedLoadout,
    },
  };
};

export default EditLoadoutPage;
