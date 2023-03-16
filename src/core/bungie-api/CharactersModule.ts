import ProtectedModule from "./ProtectedModule";
import { DestinyCharacter } from "./types";

export default class CharactersModule extends ProtectedModule {
  async getMyCharacters() {
    const { destinyMemberships, primaryMembershipId } =
      await this.auth.getMembershipData();

    const selectedMembership = primaryMembershipId
      ? destinyMemberships.find(
          (membership) => membership.membershipId === primaryMembershipId
        )
      : destinyMemberships[0];

    if (!selectedMembership) throw new Error("Destiny membership not found.");

    const { membershipId, membershipType } = selectedMembership;

    return this.fetch.get<{
      characters: {
        data: Record<string, DestinyCharacter>;
      };
    }>(`/Destiny2/${membershipType}/Profile/${membershipId}/?components=200`);
  }
}
