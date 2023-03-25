import { UserMembershipData } from "bungie-api-ts/user/interfaces";

export const getSingleMembershipData = (membership: UserMembershipData) => {
  const { primaryMembershipId, destinyMemberships } = membership;

  const selectedMembership = primaryMembershipId
    ? destinyMemberships.find(
        (membership) => membership.membershipId === primaryMembershipId
      )
    : destinyMemberships[0];

  return selectedMembership!;
};
