import { createRouter } from "./trpc";
import { destinyRoutes } from "./routes/destiny";
import { authRoutes } from "./routes/auth";

export const appRouter = createRouter({
  destiny: destinyRoutes,
  auth: authRoutes,
});

export type AppRouter = typeof appRouter;
