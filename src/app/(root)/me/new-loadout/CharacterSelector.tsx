import { DestinyCharacter } from "@/core/bungie-api/types";
import { ConsoleLog } from "@/core/components/ConsoleLog";
import { DestinyCharacterBanner } from "@/core/components/DestinyCharacterBanner";
import { TypographyLarge } from "@/core/components/typography";

interface CharacterSelectorProps {
  characters: Record<string, DestinyCharacter>;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <ConsoleLog characters={characters} />
      <TypographyLarge>Select your character</TypographyLarge>
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
};
