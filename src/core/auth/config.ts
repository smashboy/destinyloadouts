import type { AuthOptions } from "next-auth";
import { BungieAuthProvider } from "./BungieProvider";

export const authConfig = {
  providers: [BungieAuthProvider({})],
  callbacks: {
    session: ({ session, token }) => {
      // @ts-ignore
      session.user.id = token.userId;
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
    jwt: ({ token, user, account }) => {
      if (user) token.userId = user.id;
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
} satisfies AuthOptions;
