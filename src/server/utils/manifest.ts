import { type DestinyManifestTableComponent } from "@prisma/client";

export const formatPrismaDestinyManifestTableComponents = <T>(
  components: DestinyManifestTableComponent[]
) =>
  components.reduce(
    (acc, component) => ({ ...acc, [component.hashId]: component.content }),
    {}
  ) as T;
