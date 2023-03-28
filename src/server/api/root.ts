import { createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "~/server/api/routers/users";
import { loadoutsRouter } from "~/server/api/routers/loadouts";
import { authRouter } from "~/server/api/routers/auth";
import { destinyRouter } from "~/server/api/routers/destiny";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  loadouts: loadoutsRouter,
  auth: authRouter,
  destiny: destinyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
