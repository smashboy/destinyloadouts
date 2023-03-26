import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import SuperJSON from "superjson";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { prisma } from "../prisma/client";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  req,
  res,
});

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
});

export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const createRouter = t.router;

const isAuthorized = middleware(async ({ next }) => {
  const user = await prisma.user.findFirst({});

  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  return next({
    ctx: {
      authorizedUser: user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthorized);
