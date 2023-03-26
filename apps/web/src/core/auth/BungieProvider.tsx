import { OAuthProvider } from "next-auth/providers";
import { bungieNetOrigin } from "@destiny/shared/constants";

export const BungieAuthProvider: OAuthProvider = () => ({
  id: "bungie",
  name: "Bungie",
  type: "oauth",
  clientId: process.env.BUNGIE_CLIENT_ID,
  clientSecret: process.env.BUNGIE_SECRET,
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
      "X-API-Key": process.env.BUNGIE_API_KEY,
    },
  },
  profile: (profile) => {
    const { bungieNetUser: user } = profile.Response;

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
