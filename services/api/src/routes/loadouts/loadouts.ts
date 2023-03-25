import { z } from "zod";
import {
  DestinyClassType,
  DestinySublcassType,
  LoadoutStatus,
  LoadoutTag,
  prisma,
} from "../../../prisma/client";
import { createRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { getPopularDuringDate } from "../../utils/getPopularDuringDate";
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
  bookmark: protectedProcedure
    .input(
      z.object({
        loadoutId: z.string(),
      })
    )
    .mutation(
      async ({
        input: { loadoutId },
        ctx: {
          authorizedUser: { id: userId },
        },
      }) => {
        const bookmark = await prisma.loadoutBookmark.findUnique({
          where: {
            savedByUserId_loadoutId: {
              savedByUserId: userId,
              loadoutId,
            },
          },
        });

        return bookmark
          ? prisma.loadoutBookmark.delete({
              where: {
                savedByUserId_loadoutId: {
                  savedByUserId: userId,
                  loadoutId,
                },
              },
            })
          : prisma.loadoutBookmark.create({
              data: {
                savedBy: {
                  connect: {
                    id: userId,
                  },
                },
                loadout: {
                  connect: {
                    id: loadoutId,
                  },
                },
              },
            });
      }
    ),
  like: protectedProcedure
    .input(
      z.object({
        loadoutId: z.string(),
      })
    )
    .mutation(
      async ({
        input: { loadoutId },
        ctx: {
          authorizedUser: { id: userId },
        },
      }) => {
        const like = await prisma.loadoutLike.findUnique({
          where: {
            likedByUserId_loadoutId: {
              likedByUserId: userId,
              loadoutId,
            },
          },
        });

        return like
          ? prisma.loadoutLike.delete({
              where: {
                likedByUserId_loadoutId: {
                  likedByUserId: userId,
                  loadoutId,
                },
              },
            })
          : prisma.loadoutLike.create({
              data: {
                likedBy: {
                  connect: {
                    id: userId,
                  },
                },
                loadout: {
                  connect: {
                    id: loadoutId,
                  },
                },
              },
            });
      }
    ),
  create: protectedProcedure
    .input(
      z.object({
        classType: z.nativeEnum(DestinyClassType),
        subclassType: z.nativeEnum(DestinySublcassType),
        tags: z.array(z.nativeEnum(LoadoutTag)),
        status: z.nativeEnum(LoadoutStatus).optional(),
      })
    )
    .mutation(
      ({
        input: { classType, subclassType, tags, status },
        ctx: {
          authorizedUser: { id: userId },
        },
      }) =>
        prisma.loadout.create({
          data: {
            classType,
            subclassType,
            tags,
            status,
            items: {}, // TODO
            author: {
              connect: {
                id: userId,
              },
            },
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
        const popularDuringDate =
          sortBy === "POPULAR" && popularDuring !== "ALL_TIME"
            ? getPopularDuringDate(popularDuring)
            : null;

        const where = {
          classType,
          subclassType,
          tags: {
            hasSome: tags,
          },
          createdAt:
            sortBy === "POPULAR" && popularDuringDate
              ? {
                  gte: popularDuringDate,
                  lt: new Date(),
                }
              : void 0,
        };

        const orderBy =
          sortBy === "POPULAR"
            ? {
                likes: {
                  _count: "asc" as const,
                },
              }
            : {
                createdAt: "asc" as const,
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
