import { DestinyCharacterLoadout } from "@/core/bungie-api/types";
import { LoadoutArmorItem } from "@/core/components/destiny/LoadoutArmorItem";
import { LoadoutWeaponItem } from "@/core/components/destiny/LoadoutWeaponItem";
import { LoadoutInfoForm } from "./LoadoutInfoForm";

interface CharacterSocketsProps {
  loadout: DestinyCharacterLoadout;
}

export const CharacterSockets: React.FC<CharacterSocketsProps> = ({
  loadout,
}) => {
  const {
    kinetic,
    energy,
    power,
    helmet,
    gauntlets,
    chest,
    legs,
    class: classItem,
    inventoryItems,
  } = loadout;

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* <LoadoutInfoForm /> */}
      <div className="flex flex-col space-y-4">
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
};
