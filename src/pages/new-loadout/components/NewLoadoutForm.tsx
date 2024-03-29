import { useRouter } from "next/router";
import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import {
  BungieDamageTypeToDbDamageTypeMap,
  BungieDestinyClassToDbCharacterClassMap,
} from "~/constants/loadouts";
import { trpcNext } from "~/utils/api";
import { LoadoutInfoForm, type LoadoutInfoFormValues } from "./LoadoutInfoForm";
import { CharacterSockets } from "~/components/loadouts/CharacterSockets";

interface NewLoadoutForm {
  loadout: DestinyCharacterLoadout;
  character: DestinyCharacterComponent;
}

export const NewLoadoutForm: React.FC<NewLoadoutForm> = ({
  loadout,
  character,
}) => {
  const router = useRouter();

  const createLoadoutMutation = trpcNext.loadouts.create.useMutation({
    onSuccess: (loadout) =>
      router.push({
        pathname: "/[loadoutId]",
        query: {
          loadoutId: loadout.id,
        },
      }),
  });

  const handleCreateNewLoadout = ({
    statsPriority,
    ...formArgs
  }: LoadoutInfoFormValues) => {
    const { inventoryItems, subclass, ...loadoutProps } = loadout;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [subclassHash] = subclass!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subclassItem = inventoryItems[subclassHash]!;

    createLoadoutMutation.mutate({
      ...formArgs,
      items: { ...loadoutProps, subclass },
      statsPriority: statsPriority.length === 6 ? statsPriority : void 0,
      classType:
        BungieDestinyClassToDbCharacterClassMap[
          character.classType as keyof typeof BungieDestinyClassToDbCharacterClassMap
        ],
      subclassType:
        BungieDamageTypeToDbDamageTypeMap[
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subclassItem.talentGrid!
            .hudDamageType as keyof typeof BungieDamageTypeToDbDamageTypeMap
        ],
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-5 md:gap-10">
      <div className="md:col-span-2">
        <LoadoutInfoForm
          onSubmit={handleCreateNewLoadout}
          isLoading={createLoadoutMutation.isLoading}
        />
      </div>
      <div className="md:col-span-3">
        <CharacterSockets loadout={loadout} />
      </div>
    </div>
  );
};
