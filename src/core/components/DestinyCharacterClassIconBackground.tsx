"use client";
import Image from "next/image";
import { useSelectedLayoutSegments } from "next/navigation";
import {
  characterClassIconPathMap,
  destinyLogoIconPath,
} from "../bungie-api/consants";
import { DestinyCharacter } from "../bungie-api/types";

interface DestinyCharacterClassIconBackgroundProps {
  characters: Record<string, DestinyCharacter>;
}

export const DestinyCharacterClassIconBackground: React.FC<
  DestinyCharacterClassIconBackgroundProps
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
