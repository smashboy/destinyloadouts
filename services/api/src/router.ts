import { createRouter } from "./trpc";
import { destinyRoutes } from "./routes/destiny";

export const appRouter = createRouter({
  destiny: destinyRoutes,
});

export type AppRouter = typeof appRouter;
