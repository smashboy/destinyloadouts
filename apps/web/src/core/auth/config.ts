import type { AuthOptions } from "next-auth";
import { BungieAuthProvider } from "./BungieProvider";
import { trpcClient } from "../trpc/client";

export const authConfig = {
  providers: [BungieAuthProvider({})],
  callbacks: {
    signIn: async ({ user }) => {
      await trpcClient.auth.upsertUser.mutate({
        bungieAccountId: user.id,
      });
      return true;
    },
    session: ({ session, token }) => {
      console.log("AUTH SESSION", { session, token });
      // @ts-ignore
      session.user.id = token.userId;
      // @ts-ignore
      session.accessToken = token.accessToken;
      return session;
    },
    jwt: ({ token, user, account }) => {
      console.log("JWT", { token, user, account });
      if (user) token.userId = user.id;
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
} satisfies AuthOptions;
