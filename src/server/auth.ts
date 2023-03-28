import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { BungieAuthProvider } from "./BungieProvider";
import { prisma } from "./db";
// import { trpcClient } from "~/utils/api";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
    user: {
      id: string;
      name: string;
      image: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    signIn: async ({ user }) => {
      const bungieAccountId = user.id;

      await prisma.user.upsert({
        where: {
          bungieAccountId,
        },
        update: {
          bungieAccountId,
        },
        create: {
          bungieAccountId,
        },
      });
      return true;
    },
    session({ session, user, token }) {
      console.log("SET SESSION", { session, user, token });
      if (session.user && token) {
        session.user.id = session.user.email!;
        session.accessToken = token.accessToken as string;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    jwt: ({ token, user, account }) => {
      console.log("JWT", { token, user, account });
      if (user) token.userId = user.id;
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },

  providers: [
    BungieAuthProvider({}),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
