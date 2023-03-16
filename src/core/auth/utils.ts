import { getServerSession, Session } from "next-auth";
import { authConfig } from "./config";

export const getAuthSessionServer = async (): Promise<{
  user: Session["user"];
  accessToken: string;
} | null> => {
  const data = await getServerSession(authConfig);

  if (!data?.user || !data.accessToken) return null;

  const { user, accessToken } = data;

  return { accessToken, user };
};

export const isAuthenticatedServer = async () => {
  const session = await getAuthSessionServer();

  return !!session;
};
