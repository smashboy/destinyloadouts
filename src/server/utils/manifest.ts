import { type DestinyManifestTableComponent } from "@prisma/client";

export const formatPrismaDestinyManifestTableComponent = <T>(
  component: DestinyManifestTableComponent
) => component.content as unknown as T;
