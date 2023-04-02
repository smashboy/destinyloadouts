import { useRouter } from "next/router";
import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import {
  bungieCharacterClassToDbClassMap,
  bungieDamageTypeToDbDamageTypeMap,
} from "~/constants/loadouts";
import { trpcNext } from "~/utils/api";
import {
  LoadoutInfoForm,
  type LoadoutInfoFormSubmitProps,
} from "./LoadoutInfoForm";
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

  const handleCreateNewLoadout = (formArgs: LoadoutInfoFormSubmitProps) => {
    const { inventoryItems, subclass, ...loadoutProps } = loadout;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const [subclassHash] = subclass!;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const subclassItem = inventoryItems[subclassHash]!;

    createLoadoutMutation.mutate({
      ...formArgs,
      items: { ...loadoutProps, subclass },
      classType:
        bungieCharacterClassToDbClassMap[
          character.classType as keyof typeof bungieCharacterClassToDbClassMap
        ],
      subclassType:
        bungieDamageTypeToDbDamageTypeMap[
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subclassItem.talentGrid!
            .hudDamageType as keyof typeof bungieDamageTypeToDbDamageTypeMap
        ],
    });
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <LoadoutInfoForm onSubmit={handleCreateNewLoadout} />
      <CharacterSockets loadout={loadout} />
    </div>
  );
};
