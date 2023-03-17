import { ItemSocket } from "@/core/components/destiny/ItemSocket";
import { LoadoutInfoForm } from "./LoadoutInfoForm";

export const CharacterSockets = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <LoadoutInfoForm />

      <div className="flex flex-col space-y-4">
        <ItemSocket bgIconPath="/destiny-icons/weapons/kinetic.svg" />
        <ItemSocket bgIconPath="/destiny-icons/weapons/energy.svg" />
        <ItemSocket bgIconPath="/destiny-icons/weapons/power.svg" />
      </div>
      <div className="flex flex-col space-y-4">
        <ItemSocket bgIconPath="/destiny-icons/armor/helmet.svg" />
        <ItemSocket bgIconPath="/destiny-icons/armor/gloves.svg" />
        <ItemSocket bgIconPath="/destiny-icons/armor/chest.svg" />
        <ItemSocket bgIconPath="/destiny-icons/armor/boots.svg" />
        <ItemSocket bgIconPath="/destiny-icons/armor/class.svg" />
      </div>
    </div>
  );
};
