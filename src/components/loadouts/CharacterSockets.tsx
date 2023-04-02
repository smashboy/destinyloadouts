import { type DestinyCharacterLoadout } from "~/bungie/types";
import { TypographyLarge } from "~/components/typography";
import { LoadoutSubclassItem } from "~/components/destiny/LoadoutSubclassItem";
import { LoadoutWeaponItem } from "~/components/destiny/LoadoutWeaponItem";
import { LoadoutArmorItem } from "~/components/destiny/LoadoutArmorItem";

interface CharacterSocketsProps {
  loadout: DestinyCharacterLoadout;
}

export const CharacterSockets: React.FC<CharacterSocketsProps> = ({
  loadout: {
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
  },
}) => (
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
);
