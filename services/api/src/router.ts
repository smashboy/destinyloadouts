import { createRouter } from "./trpc";
import { destinyRoutes } from "./routes/destiny";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";

export const appRouter = createRouter({
  destiny: destinyRoutes,
  auth: authRoutes,
  users: usersRoutes,
});

export type AppRouter = typeof appRouter;
