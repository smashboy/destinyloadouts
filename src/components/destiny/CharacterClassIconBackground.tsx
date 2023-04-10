import Image from "next/image";
import { type DestinyClassType } from "@prisma/client";
import { destinyLogoIconPath } from "~/bungie/constants";
import { characterClassIconPathMap } from "~/constants/loadouts";

interface CharacterClassIconBackgroundProps {
  classType?: DestinyClassType;
}

export const CharacterClassIconBackground: React.FC<
  CharacterClassIconBackgroundProps
> = ({ classType }) => {
  const iconPath =
    (classType && characterClassIconPathMap[classType]) || destinyLogoIconPath;

  return (
    <div className="pointer-events-none fixed inset-0 left-56 flex items-center justify-center opacity-10 dark:bg-neutral-900">
      <Image
        src={iconPath}
        width={256}
        height={256}
        alt="Destiny character class type"
        className="dark:invert"
      />
    </div>
  );
};
