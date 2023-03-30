import { useRouter } from "next/router";
import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import { type DestinyCharacterLoadout } from "~/bungie/types";
import {
  LoadoutInfoForm,
  type LoadoutInfoFormSubmitProps,
} from "./LoadoutInfoForm";
import { TypographyLarge } from "~/components/typography";
import { LoadoutSubclassItem } from "~/components/destiny/LoadoutSubclassItem";
import { LoadoutWeaponItem } from "~/components/destiny/LoadoutWeaponItem";
import { LoadoutArmorItem } from "~/components/destiny/LoadoutArmorItem";
import { trpcNext } from "~/utils/api";
import {
  bungieCharacterClassToDbClassMap,
  bungieDamageTypeToDbDamageTypeMap,
} from "~/constants/loadouts";

interface CharacterSocketsProps {
  loadout: DestinyCharacterLoadout;
  character: DestinyCharacterComponent;
}

export const CharacterSockets: React.FC<CharacterSocketsProps> = ({
  loadout,
  character,
}) => {
  const router = useRouter();

  const {
    kinetic,
    energy,
    power,
    helmet,
    gauntlets,
    chest,
    legs,
    class: classItem,
    subclass,
    inventoryItems,
  } = loadout;

  const createLoadoutMutation = trpcNext.loadouts.create.useMutation();

  const handleCreateNewLoadout = async (
    formArgs: LoadoutInfoFormSubmitProps
  ) => {
    const { inventoryItems, ...loadoutProps } = loadout;

    const [subclassHash] = subclass!;

    const subclassItem = inventoryItems[subclassHash]!;

    const { authorId, id } = await createLoadoutMutation.mutateAsync({
      ...formArgs,
      items: loadoutProps,
      classType:
        bungieCharacterClassToDbClassMap[
          character.classType as keyof typeof bungieCharacterClassToDbClassMap
        ],
      subclassType:
        bungieDamageTypeToDbDamageTypeMap[
          subclassItem.talentGrid!
            .hudDamageType as keyof typeof bungieDamageTypeToDbDamageTypeMap
        ],
    });

    router.push({
      pathname: "/[userId]/[loadoutId]",
      query: {
        userId: authorId,
        loadoutId: id,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-10">
      <LoadoutInfoForm onSubmit={handleCreateNewLoadout} />
      <div className="grid grid-cols-1 gap-4">
        <TypographyLarge>Subclass</TypographyLarge>
        <LoadoutSubclassItem item={subclass} inventoryItems={inventoryItems} />
        <div className="flex flex-col space-y-4">
          <TypographyLarge>Weapons</TypographyLarge>
          <LoadoutWeaponItem
            item={kinetic}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/weapons/kinetic.svg",
            }}
          />
          <LoadoutWeaponItem
            item={energy}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/weapons/energy.svg",
            }}
          />
          <LoadoutWeaponItem
            item={power}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/weapons/power.svg",
            }}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <TypographyLarge>Armor</TypographyLarge>
          <LoadoutArmorItem
            item={helmet}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/helmet.svg",
            }}
          />
          <LoadoutArmorItem
            item={gauntlets}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/gloves.svg",
            }}
          />
          <LoadoutArmorItem
            item={chest}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/chest.svg",
            }}
          />
          <LoadoutArmorItem
            item={legs}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/boots.svg",
            }}
          />
          <LoadoutArmorItem
            item={classItem}
            inventoryItems={inventoryItems}
            socketProps={{
              bgIconPath: "/destiny-icons/armor/class.svg",
            }}
          />
        </div>
      </div>
    </div>
  );
};
