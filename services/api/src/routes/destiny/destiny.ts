import { createRouter } from "../../trpc";
import { destinyManifestRoutes } from "./manifest";

export const destinyRoutes = createRouter({
  manifest: destinyManifestRoutes,
});
