import ProtectedModule from "./ProtectedModule";
import { DestinyCharacter, DestinyCharacterLoadout } from "./types";

export default class CharactersModule extends ProtectedModule {
  async getMyCharacters() {
    const membership = await this.auth.getSingleMembershipData();

    if (!membership) throw new Error("Destiny membership not found.");

    const { membershipId, membershipType } = membership;

    return this.fetch.get<{
      characters: {
        data: Record<string, DestinyCharacter>;
      };
    }>(`/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`);
  }

  async getLoadouts(characterId: string) {
    const membership = await this.auth.getSingleMembershipData();

    if (!membership) throw new Error("Destiny membership not found.");

    const { membershipId, membershipType } = membership;

    // `/Destiny2/${membershipType}/Profile/${membershipId}/Character/${characterId}/?components=206`

    return this.fetch.get<{
      characterLoadouts: {
        data: Record<string, { loadouts: DestinyCharacterLoadout[] }>;
      };
    }>(`/Destiny2/${membershipType}/Profile/${membershipId}/?components=206`);
  }
}
