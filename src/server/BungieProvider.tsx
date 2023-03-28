import { type GeneralUser } from "bungie-api-ts/user";
import type { OAuthProvider } from "next-auth/providers";
import { bungieNetOrigin } from "~/bungie/constants";
import { env } from "~/env.mjs";

export const BungieAuthProvider: OAuthProvider = () => ({
  id: "bungie",
  name: "Bungie",
  type: "oauth",
  clientId: env.BUNGIE_CLIENT_ID,
  clientSecret: env.BUNGIE_CLIENT_SECRET,
  token: `${bungieNetOrigin}/platform/app/oauth/token/`,
  authorization: {
    url: `${bungieNetOrigin}/en/OAuth/Authorize?reauth=true`,
    params: {
      scope: "",
    },
  },
  userinfo: {
    url: `${bungieNetOrigin}/Platform/User/GetMembershipsForCurrentUser/`,
  },
  httpOptions: {
    headers: {
      "X-API-Key": env.BUNGIE_API_KEY,
    },
  },
  profile: (profile) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = profile.Response.bungieNetUser as GeneralUser;

    return {
      id: user.membershipId,
      name: user.displayName,
      email: user.membershipId,
      image: `${bungieNetOrigin}${
        user.profilePicturePath.startsWith("/") ? "" : "/"
      }${user.profilePicturePath}`,
    };
  },
});
