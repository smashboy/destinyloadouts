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

const loadoutItemValidation = z
  .tuple([z.number().int(), z.array(z.number().int())])
  .nullable();

const loadoutValidation = z.object({
  content: z.object({
    helmet: loadoutItemValidation,
    gauntlets: loadoutItemValidation,
    chest: loadoutItemValidation,
    legs: loadoutItemValidation,
    class: loadoutItemValidation,
    kinetic: loadoutItemValidation,
    energy: loadoutItemValidation,
    power: loadoutItemValidation,
    subclass: loadoutItemValidation,
  }),
});

const cursorValidation = z
  .object({
    take: z.number().int(),
    skip: z.number().int(),
  })
  .nullable()
  .optional();

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
  getLikedByUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ input: { userId } }) =>
      prisma.loadout.findMany({
        where: {
          likes: {
            every: {
              likedByUserId: userId,
            },
          },
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
        const where = {
          savedByUserId_loadoutId: {
            savedByUserId: userId,
            loadoutId,
          },
        };

        const bookmark = await prisma.loadoutBookmark.findUnique({
          where,
        });

        return bookmark
          ? prisma.loadoutBookmark.delete({
              where,
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
        const where = {
          likedByUserId_loadoutId: {
            likedByUserId: userId,
            loadoutId,
          },
        };

        const like = await prisma.loadoutLike.findUnique({
          where,
        });

        return like
          ? prisma.loadoutLike.delete({
              where,
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
  getBookmarked: protectedProcedure.query(
    ({
      ctx: {
        authorizedUser: { id: userId },
      },
    }) =>
      prisma.loadout.findMany({
        where: {
          bookmarks: {
            every: {
              savedByUserId: userId,
            },
          },
        },
      })
  ),
  create: protectedProcedure
    .input(
      z.object({
        classType: z.nativeEnum(DestinyClassType),
        subclassType: z.nativeEnum(DestinySublcassType),
        tags: z.array(z.nativeEnum(LoadoutTag)),
        status: z.nativeEnum(LoadoutStatus).optional(),
        loadout: loadoutValidation,
      })
    )
    .mutation(
      ({
        input: { classType, subclassType, tags, status, loadout },
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
            items: loadout,
            author: {
              connect: {
                id: userId,
              },
            },
          },
        })
    ),
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        cursor: cursorValidation,
      })
    )
    .query(async ({ input: { userId, cursor } }) => {
      const { take = 15, skip = 0 } = cursor || {};
      const where = { authorId: userId };
      const orderBy = { createdAt: "desc" as const };

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
            include: {
              author: true, // todo, can be improved
            },
          }),
      });

      const manifest = await prisma.destinyManifest.findFirst();

      const inventoryItems = await getLoadoutsInventoryItems(
        loadouts,
        manifest!
      );

      console.log("HELLO!?!?!?!?", inventoryItems.length, loadouts.length);

      return {
        loadouts,
        inventoryItems,
        hasMore,
        cursor: nextPage,
      };
    }),
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
              include: {
                author: true, // todo, can be improved
              },
            }),
        });

        const manifest = await prisma.destinyManifest.findFirst();

        const inventoryItems = await getLoadoutsInventoryItems(
          loadouts,
          manifest!
        );

        return {
          loadouts,
          inventoryItems,
          hasMore,
          nextPage,
        };
      }
    ),
});
