import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { type TokenSet } from "@auth/core/types";
import { BungieAuthProvider } from "./BungieProvider";
import { prisma } from "./db";
import { bungieNetOrigin } from "~/bungie/constants";
import { env } from "~/env.mjs";
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
      email: string;
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
      const bungieAccountDisplayName = user.name as string;
      const bungieAccountProfilePicturePath = user.image as string;

      await prisma.user.upsert({
        where: {
          bungieAccountId,
        },
        update: {
          bungieAccountId,
          bungieAccountDisplayName,
          bungieAccountProfilePicturePath,
        },
        create: {
          bungieAccountId,
          bungieAccountDisplayName,
          bungieAccountProfilePicturePath,
        },
      });
      return true;
    },
    session({ session, token }) {
      if (session.user && token) {
        console.log("SESSION", { session, token });
        session.user.id = token.userId;
        session.accessToken = token.accessToken as string;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
    jwt: async ({ token, user, account }) => {
      if (account) {
        const newToken = {
          accessToken: account.access_token,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expiresAt: account.expires_at!,
          refreshToken: account.refresh_token,
        };

        if (user) newToken.userId = user.id;

        console.log("NEW AUTH TOKEN:", newToken);

        return newToken;
      } else if (Date.now() < token.expiresAt * 1000) {
        console.log("TOKEN NOT EXPIRED:", token);
        // If the access token has not expired yet, return it
        return token;
      } else {
        console.log("TRYING TO REFRESH TOKEN:", token);
        try {
          const response = await fetch(
            `${bungieNetOrigin}/platform/app/oauth/token/`,
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-API-Key": env.BUNGIE_API_KEY,
              },
              body: new URLSearchParams({
                client_id: env.BUNGIE_CLIENT_ID,
                client_secret: env.BUNGIE_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: token.refreshToken as string,
              }),
              method: "POST",
            }
          );

          const tokens: TokenSet = await response.json();

          if (!response.ok) throw tokens;

          const newToken = {
            ...token, // Keep the previous token properties
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
            // Fall back to old refresh token, but note that
            // many providers may only allow using a refresh token once.
            refreshToken: tokens.refresh_token ?? token.refreshToken,
          };

          console.log("TOKEN REFRESHED SUCCESSFULLY:", { newToken, tokens });

          return newToken;
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property will be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
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
