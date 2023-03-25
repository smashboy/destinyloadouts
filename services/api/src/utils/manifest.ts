import type { DestinyManifestTableComponent } from "@services/destiny-manifest/src/web";

export const formatPrismaDestinyManifestTableComponent = <T>(
  component: DestinyManifestTableComponent
) => component.content as unknown as T;
