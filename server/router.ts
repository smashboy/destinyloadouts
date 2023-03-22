import { destinyRoutes } from "./routes/destiny";
import { createRouter } from "./trpc";

export const appRouter = createRouter({
  destiny: destinyRoutes,
});

export type AppRouter = typeof appRouter;
