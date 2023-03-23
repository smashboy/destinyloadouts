import { inferAsyncReturnType, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  req,
  res,
});

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const createRouter = t.router;