import type { AuthOptions } from "next-auth";
import BungieProvider from "next-auth/providers/bungie";

export const authConfig = {
  providers: [
    BungieProvider({
      clientId: process.env.BUNGIE_CLIENT_ID,
      clientSecret: process.env.BUNGIE_SECRET,
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
    }),
  ],
} satisfies AuthOptions;
