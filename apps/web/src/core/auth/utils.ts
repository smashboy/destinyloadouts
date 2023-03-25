import { GetServerSidePropsContext } from "next";
import { getServerSession, Session } from "next-auth";
import { authConfig } from "./config";

export const getAuthSessionServer = async (
  ctx: GetServerSidePropsContext
): Promise<{
  user: Session["user"];
  accessToken: string;
} | null> => {
  const data = await getServerSession(ctx.req, ctx.res, authConfig);

  if (!data?.user || !data?.accessToken) return null;

  const { user, accessToken } = data;

  return { accessToken, user };
};

export const isAuthenticatedServer = async (ctx: GetServerSidePropsContext) => {
  const session = await getAuthSessionServer(ctx);

  return !!session;
};
