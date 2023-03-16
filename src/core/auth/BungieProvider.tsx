import { OAuthProvider } from "next-auth/providers";

export const BungieAuthProvider: OAuthProvider = () => ({
  id: "bungie",
  name: "Bungie",
  type: "oauth",
  clientId: process.env.BUNGIE_CLIENT_ID,
  clientSecret: process.env.BUNGIE_SECRET,
  token: "https://www.bungie.net/platform/app/oauth/token/",
  authorization: {
    url: "https://www.bungie.net/en/OAuth/Authorize?reauth=true",
    params: {
      scope: "",
    },
  },
  userinfo: {
    url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
  },
  httpOptions: {
    headers: {
      "X-API-Key": process.env.BUNGIE_API_KEY,
    },
  },
  profile: (profile, tokens) => {
    const { bungieNetUser: user } = profile.Response;

    console.log("PROFILE TRIGGER", user);

    return {
      id: user.membershipId,
      name: user.displayName,
      email: user.membershipId,
      image: `https://www.bungie.net${
        user.profilePicturePath.startsWith("/") ? "" : "/"
      }${user.profilePicturePath}`,
      profile,
      tokens,
    };
  },
});
