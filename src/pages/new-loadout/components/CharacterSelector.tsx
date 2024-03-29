import { type DestinyCharacterComponent } from "bungie-api-ts/destiny2";
import { TypographyLarge } from "~/components/typography";
import { DestinyCharacterBanner } from "./DestinyCharacterBanner";

interface CharacterSelectorProps {
  characters: Record<string, DestinyCharacterComponent>;
  basePath?: string;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  characters,
  basePath = "/new-loadout",
}) => (
  <div className="flex flex-col space-y-2">
    <TypographyLarge>Select character</TypographyLarge>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Object.values(characters).map((character) => (
        <DestinyCharacterBanner
          key={character.characterId}
          character={character}
          basePath={basePath}
        />
      ))}
    </div>
  </div>
);
