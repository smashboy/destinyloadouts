import { DestinyCharacterLoadout } from "@/core/bungie-api/types";
import { LoadoutItemSocket } from "@/core/components/destiny/LoadoutItemSocket";
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
  } = loadout;

  return (
    <div className="grid grid-cols-3 gap-4">
      <LoadoutInfoForm />
      <div className="flex flex-col space-y-4">
        <LoadoutItemSocket
          item={kinetic}
          bgIconPath="/destiny-icons/weapons/kinetic.svg"
        />
        <LoadoutItemSocket
          item={energy}
          bgIconPath="/destiny-icons/weapons/energy.svg"
        />
        <LoadoutItemSocket
          item={power}
          bgIconPath="/destiny-icons/weapons/power.svg"
        />
      </div>
      <div className="flex flex-col space-y-4">
        <LoadoutItemSocket
          item={helmet}
          bgIconPath="/destiny-icons/armor/helmet.svg"
        />
        <LoadoutItemSocket
          item={gauntlets}
          bgIconPath="/destiny-icons/armor/gloves.svg"
        />
        <LoadoutItemSocket
          item={chest}
          bgIconPath="/destiny-icons/armor/chest.svg"
        />
        <LoadoutItemSocket
          item={legs}
          bgIconPath="/destiny-icons/armor/boots.svg"
        />
        <LoadoutItemSocket
          item={classItem}
          bgIconPath="/destiny-icons/armor/class.svg"
        />
      </div>
    </div>
  );
};
