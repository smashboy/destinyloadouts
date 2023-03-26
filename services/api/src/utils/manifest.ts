import { DestinyManifestTableComponent } from "../../prisma/.prisma";

export const formatPrismaDestinyManifestTableComponent = <T>(
  component: DestinyManifestTableComponent
) => component.content as unknown as T;
