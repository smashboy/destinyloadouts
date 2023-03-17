import { DestinyItemSocket } from "@/core/components/DestinyItemSocket";

export const CharacterSockets = () => {
  return (
    <div className="flex space-x-4">
      <div className="flex flex-col space-y-4">
        <DestinyItemSocket bgIconPath="/destiny-icons/weapons/kinetic.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/weapons/energy.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/weapons/power.svg" />
      </div>
      <div className="flex flex-col space-y-4">
        <DestinyItemSocket bgIconPath="/destiny-icons/armor/helmet.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/armor/gloves.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/armor/chest.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/armor/boots.svg" />
        <DestinyItemSocket bgIconPath="/destiny-icons/armor/class.svg" />
      </div>
    </div>
  );
};
