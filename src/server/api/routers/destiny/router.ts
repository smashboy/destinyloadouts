import { createTRPCRouter } from "~/server/api/trpc";
import { destinyManifestRouter } from "./manifest";

export const destinyRouter = createTRPCRouter({
  manifest: destinyManifestRouter,
});
