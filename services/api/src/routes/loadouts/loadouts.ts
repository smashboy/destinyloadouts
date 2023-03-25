import { z } from "zod";
import {
  DestinyClassType,
  DestinySublcassType,
  LoadoutTag,
  prisma,
} from "../../../prisma/client";
import { createRouter, publicProcedure } from "../../trpc";
import { getLoadoutsInventoryItems } from "../../utils/loadouts";
import { paginate } from "../../utils/paginate";

export const loadoutsRoutes = createRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input: { id } }) =>
      prisma.loadout.findFirst({
        where: {
          id,
        },
      })
    ),
  feed: publicProcedure
    .input(
      z.object({
        classType: z.nativeEnum(DestinyClassType).optional(),
        subclassType: z.nativeEnum(DestinySublcassType).optional(),
        tags: z.array(z.nativeEnum(LoadoutTag)).optional(),
        take: z.number().int(),
        skip: z.number().int(),
        sortBy: z.enum(["LATEST", "POPULAR"]).default("LATEST"),
        popularDuring: z
          .enum(["TODAY", "WEEK", "MONTH", "ALL_TIME"])
          .default("TODAY"),
      })
    )
    .query(
      async ({
        input: {
          take,
          skip,
          sortBy,
          classType,
          subclassType,
          tags,
          popularDuring,
        },
      }) => {
        const where = {
          classType,
          subclassType,
          tags: {
            hasSome: tags,
          },
        };

        const orderBy =
          sortBy === "LATEST"
            ? {
                createdAt: "asc" as const,
              }
            : {
                likes: {
                  _count: "asc" as const,
                },
              };

        const {
          items: loadouts,
          hasMore,
          nextPage,
        } = await paginate({
          take,
          skip,
          count: () => prisma.loadout.count({ where, orderBy }),
          query: (paginateArgs) =>
            prisma.loadout.findMany({
              ...paginateArgs,
              where,
              orderBy,
            }),
        });

        const inventoryItems = await getLoadoutsInventoryItems(loadouts);

        return {
          loadouts,
          inventoryItems,
          hasMore,
          nextPage,
        };
      }
    ),
});
