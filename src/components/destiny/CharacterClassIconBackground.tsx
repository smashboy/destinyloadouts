import Image from "next/image";
import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import {
  characterClassIconPathMap,
  destinyLogoIconPath,
} from "~/bungie/constants";

interface CharacterClassIconBackgroundProps {
  character?: DestinyCharacterComponent;
}

export const CharacterClassIconBackground: React.FC<
  CharacterClassIconBackgroundProps
> = ({ character }) => {
  const iconPath =
    characterClassIconPathMap[
      character?.classType as keyof typeof characterClassIconPathMap
    ] || destinyLogoIconPath;

  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-10">
      <Image
        src={iconPath}
        width={256}
        height={256}
        alt="Destiny character class type"
      />
    </div>
  );
};
