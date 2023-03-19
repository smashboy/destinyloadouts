"use client";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import {
  characterClassIconPathMap,
  destinyLogoIconPath,
} from "../../bungie-api/consants";

interface CharacterClassIconBackgroundProps {
  characters: Record<string, DestinyCharacterComponent>;
}

export const CharacterClassIconBackground: React.FC<
  CharacterClassIconBackgroundProps
> = ({ characters }) => {
  const segments = useSelectedLayoutSegments();

  const iconPath =
    characterClassIconPathMap[
      characters[segments[0]]
        ?.classType as keyof typeof characterClassIconPathMap
    ] || destinyLogoIconPath;

  return (
    <div className="fixed flex inset-0 -z-10 justify-center items-center opacity-10">
      <Image
        src={iconPath}
        width={256}
        height={256}
        alt="Destiny character class type"
      />
    </div>
  );
};