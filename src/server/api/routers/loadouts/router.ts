import {
  DestinyClassType,
  DestinyDamageType,
  LoadoutStatus,
  LoadoutTag,
} from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getPopularDuringDate } from "~/server/utils/getPopularDuringDate";
import { paginate } from "~/server/utils/paginate";

const loadoutItemValidation = z
  .tuple([z.number().int(), z.array(z.number().int())])
  .nullable();

const loadoutValidation = z.object({
  name: z.string().min(1).max(75),
  description: z.unknown().optional(),
  classType: z.nativeEnum(DestinyClassType),
  subclassType: z.nativeEnum(DestinyDamageType),
  tags: z.array(z.nativeEnum(LoadoutTag)),
  status: z.nativeEnum(LoadoutStatus).optional(),
  items: z.object({
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

export const loadoutsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input: { id }, ctx: { prisma } }) =>
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
    .query(({ input: { userId }, ctx: { prisma } }) =>
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
          session: {
            user: { id: userId },
          },
          prisma,
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
          session: {
            user: { id: userId },
          },
          prisma,
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
        session: {
          user: { id: userId },
        },
        prisma,
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
  create: protectedProcedure.input(loadoutValidation).mutation(
    ({
      input: {
        classType,
        subclassType,
        tags,
        status,
        items,
        name,
        description,
      },
      ctx: {
        session: {
          user: { id: userId },
        },
        prisma,
      },
    }) =>
      prisma.loadout.create({
        data: {
          name,
          classType,
          subclassType,
          description,
          tags,
          status,
          items,
          author: {
            connect: {
              bungieAccountId: userId,
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
    .query(async ({ input: { userId, cursor }, ctx: { prisma } }) => {
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

      // const manifest = await prisma.destinyManifest.findFirst();

      // const inventoryItems = await getLoadoutsInventoryItems(
      //   loadouts,
      //   manifest!
      // );

      return {
        loadouts,
        // inventoryItems,
        hasMore,
        cursor: nextPage,
      };
    }),
  feed: publicProcedure
    .input(
      z.object({
        classType: z.nativeEnum(DestinyClassType).optional(),
        subclassType: z.nativeEnum(DestinyDamageType).optional(),
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
        ctx: { prisma },
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

        // const manifest = await prisma.destinyManifest.findFirst();

        // const inventoryItems = await getLoadoutsInventoryItems(
        //   loadouts,
        //   manifest!
        // );

        return {
          loadouts,
          // inventoryItems,
          hasMore,
          nextPage,
        };
      }
    ),
});
