import Image from "next/image";
import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import {
  characterClassIconPathMap,
  destinyLogoIconPath,
} from "@destiny/shared/constants";

interface CharacterClassIconBackgroundProps {
  characters: Record<string, DestinyCharacterComponent>;
  selecetedCharacterId?: string;
}

export const CharacterClassIconBackground: React.FC<
  CharacterClassIconBackgroundProps
> = ({ characters, selecetedCharacterId }) => {
  const iconPath =
    characterClassIconPathMap[
      characters[selecetedCharacterId!]
        ?.classType as keyof typeof characterClassIconPathMap
    ] || destinyLogoIconPath;

  return (
    <div className="fixed flex inset-0 justify-center items-center opacity-10">
      <Image
        src={iconPath}
        width={256}
        height={256}
        alt="Destiny character class type"
      />
    </div>
  );
};
