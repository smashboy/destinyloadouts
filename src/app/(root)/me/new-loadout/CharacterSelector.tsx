import { DestinyCharacter } from "@/core/bungie-api/types";
import { TypographyLarge } from "@/core/components/typography";
import { DestinyCharacterBanner } from "./DestinyCharacterBanner";

interface CharacterSelectorProps {
  characters: Record<string, DestinyCharacter>;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
}) => (
  <div className="flex flex-col space-y-2">
    <TypographyLarge>Select character</TypographyLarge>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.values(characters).map((character) => (
        <DestinyCharacterBanner
          key={character.characterId}
          character={character}
        />
      ))}
    </div>
  </div>
);
