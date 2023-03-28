import { createTRPCRouter } from "~/server/api/trpc";
import { destinyLatestManifestRouter } from "./latest";

export const destinyManifestRouter = createTRPCRouter({
  latest: destinyLatestManifestRouter,
});
