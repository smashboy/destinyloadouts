import { createRouter } from "./trpc";
import { destinyRoutes } from "./routes/destiny";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import { loadoutsRoutes } from "./routes/loadouts";

export const appRouter = createRouter({
  destiny: destinyRoutes,
  auth: authRoutes,
  users: usersRoutes,
  loadouts: loadoutsRoutes,
});

export type AppRouter = typeof appRouter;
