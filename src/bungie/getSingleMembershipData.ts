import { type UserMembershipData } from "bungie-api-ts/user/interfaces";

export const getSingleMembershipData = (membership: UserMembershipData) => {
  const { primaryMembershipId, destinyMemberships } = membership;

  const selectedMembership = primaryMembershipId
    ? destinyMemberships.find(
        (membership) => membership.membershipId === primaryMembershipId
      )
    : destinyMemberships[0];

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return selectedMembership!;
};
