import { getServerSession } from "next-auth";
import { authConfig } from "./config";

export const getAuthSessionServer = () => getServerSession(authConfig);

export const isAuthenticatedServer = async () => {
  const session = await getAuthSessionServer();

  return !!session;
};
