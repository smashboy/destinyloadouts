import { createRouter } from "../../../trpc";
import { destinyLatestManifestRoutes } from "./latest";

export const destinyManifestRoutes = createRouter({
  latest: destinyLatestManifestRoutes,
});
