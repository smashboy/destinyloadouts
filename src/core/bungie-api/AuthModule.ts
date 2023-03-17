import BaseModule from "./BaseModule";
import { BungieNetUser, DestinyMembership } from "./types";

export default class AuthModule extends BaseModule {
  getMembershipData() {
    return this.fetch.get<{
      bungieNetUser: BungieNetUser;
      destinyMemberships: DestinyMembership[];
      primaryMembershipId: string | null;
    }>("/User/GetMembershipsForCurrentUser");
  }

  async getSingleMembershipData() {
    const { destinyMemberships, primaryMembershipId } =
      await this.getMembershipData();

    const selectedMembership = primaryMembershipId
      ? destinyMemberships.find(
          (membership) => membership.membershipId === primaryMembershipId
        )
      : destinyMemberships[0];

    return selectedMembership;
  }
}
