import {
  DestinyClassType,
  DestinyDamageType,
  LoadoutStatus,
  LoadoutTag,
  type User,
  type Prisma,
} from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";
import { getPopularDuringDate } from "~/server/utils/getPopularDuringDate";
import { paginate } from "~/server/utils/paginate";
import { destinyLatestManifestRouterCaller } from "../destiny/manifest/latest";
import { type LoadoutItem } from "~/bungie/types";
import { formatPrismaDestinyManifestTableComponents } from "~/server/utils/manifest";
import { LoadoutLikesSelectCommon, LoadoutIncludeCommon } from "./common";
import { getLoadoutItemHashes } from "~/utils/loadout";
import { usersRouterCaller } from "../users/router";
import { TRPCError } from "@trpc/server";
import { type ArrayElement } from "~/utils/types";
import { hasAnHourPassed } from "./utils";

const loadoutItemValidation = z
  .tuple([z.number().int(), z.array(z.number().int())])
  .nullable()
  .optional();

const loadoutValidation = z.object({
  name: z.string().min(1).max(120),
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
  .optional();

export const loadoutsRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        loadoutId: z.string(),
      })
    )
    .query(async ({ input: { loadoutId }, ctx: { prisma, session } }) => {
      const loadout = await prisma.loadout.findFirst({
        where: {
          id: loadoutId,
        },
        include: LoadoutIncludeCommon({ includeAuthor: true }),
      });

      if (!loadout) return null;

      const previewItemHashes = getLoadoutItemHashes(
        loadout.items as unknown as Record<string, LoadoutItem>
      );

      const manifestCaller = destinyLatestManifestRouterCaller({
        prisma,
        session,
      });

      const inventoryItems = await manifestCaller.getTableComponents({
        tableName: "DestinyInventoryItemDefinition",
        locale: "en",
        hashIds: [...new Set(previewItemHashes)],
      });

      return {
        loadout,
        inventoryItems:
          formatPrismaDestinyManifestTableComponents<
            Record<string, DestinyInventoryItemDefinition>
          >(inventoryItems),
      };
    }),
  canEdit: protectedProcedure
    .input(
      z.object({
        loadoutId: z.string(),
      })
    )
    .query(
      async ({
        input: { loadoutId },
        ctx: {
          session: {
            user: { id: authUserId },
          },
          prisma,
        },
      }) => {
        const loadout = await prisma.loadout.findFirst({
          where: {
            id: loadoutId,
          },
          select: {
            createdAt: true,
            authorId: true,
          },
        });

        if (!loadout) throw new TRPCError({ code: "NOT_FOUND" });

        const { createdAt, authorId } = loadout;

        if (authorId !== authUserId)
          throw new TRPCError({ code: "UNAUTHORIZED" });

        return !hasAnHourPassed(createdAt);
      }
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
  getLoadoutLikes: publicProcedure
    .input(
      z.object({
        loadoutId: z.string(),
      })
    )
    .query(({ ctx: { prisma, session }, input: { loadoutId } }) =>
      prisma.loadout.findFirst({
        where: {
          id: loadoutId,
        },
        select: LoadoutLikesSelectCommon(session?.user.id),
      })
    ),
  getLoadoutLikesList: publicProcedure
    .input(
      z.object({
        loadoutIds: z.array(z.string()),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { loadoutIds } }) => {
      const list = await prisma.loadout.findMany({
        where: {
          id: {
            in: loadoutIds,
          },
        },
        select: LoadoutLikesSelectCommon(session?.user.id),
      });

      return list.reduce(
        (acc, item) => ({ ...acc, [item.id]: item }),
        {}
      ) as Record<string, ArrayElement<typeof list>>;
    }),
  create: protectedProcedure.input(loadoutValidation).mutation(
    async ({
      input: {
        classType,
        subclassType,
        tags,
        // status,
        items,
        name,
        description,
      },
      ctx: {
        session: {
          user: { id: userId },
        },
        prisma,
        res,
      },
    }) => {
      const loadout = await prisma.loadout.create({
        data: {
          name,
          classType,
          subclassType,
          status: LoadoutStatus.PUBLISHED, // todo remove when user will be able to change status on client
          description: description as Prisma.InputJsonValue,
          tags: {
            createMany: {
              data: tags.map((tag) => ({ tag })),
            },
          },
          items,
          author: {
            connect: {
              id: userId,
            },
          },
        },
      });

      await res?.revalidate(`/user/${userId}`);

      return loadout;
    }
  ),
  update: protectedProcedure
    .input(
      z.object({
        loadoutId: z.string(),
        loadout: loadoutValidation,
      })
    )
    .mutation(
      async ({
        input: {
          loadoutId,
          loadout: {
            classType,
            subclassType,
            tags,
            // status,
            items,
            name,
            description,
          },
        },
        ctx: {
          session: {
            user: { id: authUserId },
          },
          res,
          prisma,
        },
      }) => {
        const loadout = await prisma.loadout.findFirst({
          where: {
            id: loadoutId,
          },
          select: {
            createdAt: true,
            authorId: true,
          },
        });

        if (!loadout) throw new TRPCError({ code: "NOT_FOUND" });

        const { createdAt, authorId } = loadout;

        if (authorId !== authUserId)
          throw new TRPCError({ code: "UNAUTHORIZED" });

        if (hasAnHourPassed(createdAt))
          throw new TRPCError({ code: "FORBIDDEN" });

        await prisma.loadoutTagLink.deleteMany({
          where: {
            loadoutId,
          },
        });

        await prisma.loadout.update({
          where: {
            id: loadoutId,
          },
          data: {
            name,
            classType,
            subclassType,
            status: LoadoutStatus.PUBLISHED, // todo remove when user will be able to change status on client
            description: description as Prisma.InputJsonValue,
            tags: {
              createMany: {
                data: tags.map((tag) => ({ tag })),
              },
            },
            items,
          },
        });

        await res?.revalidate(`/user/${authorId}`);
        await res?.revalidate(`/${loadoutId}`);
      }
    ),
  delete: protectedProcedure
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
          res,
          prisma,
        },
      }) => {
        const loadout = await prisma.loadout.findFirst({
          where: {
            id: loadoutId,
          },
        });

        if (!loadout) throw new TRPCError({ code: "NOT_FOUND" });

        const { authorId } = loadout;

        if (authorId !== userId) throw new TRPCError({ code: "UNAUTHORIZED" });

        await prisma.loadout.delete({
          where: {
            id: loadoutId,
          },
        });

        await res?.revalidate(`/user/${authorId}`);
        await res?.revalidate(`/${loadoutId}`);

        return loadout;
      }
    ),
  getAuthBookmarked: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const {
        user: { id: authUserId },
      } = session;

      const loadouts = await prisma.loadout.findMany({
        where: {
          bookmarks: {
            some: {
              savedByUserId: authUserId,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        include: LoadoutIncludeCommon({
          includeAuthor: true,
          authUserId,
        }),
      });

      const manifestCaller = destinyLatestManifestRouterCaller({
        prisma,
        session: null,
      });

      const previewItemHashes = loadouts
        .map((loadout) =>
          getLoadoutItemHashes(
            loadout.items as unknown as Record<string, LoadoutItem>
          )
        )
        .flat();

      const inventoryItems = await manifestCaller.getTableComponents({
        tableName: "DestinyInventoryItemDefinition",
        locale: "en",
        hashIds: [...new Set(previewItemHashes)],
      });

      return {
        loadouts,
        inventoryItems:
          formatPrismaDestinyManifestTableComponents<
            Record<string, DestinyInventoryItemDefinition>
          >(inventoryItems),
      };
    }
  ),
  getByUserId: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        onlyLiked: z.boolean().optional(),
        cursor: cursorValidation,
      })
    )
    .query(
      async ({
        input: { userId, onlyLiked, cursor = { take: 10, skip: 0 } },
        ctx: { prisma, session },
      }) => {
        const bungieAccountId = session?.user.id;

        let authUser: User | null = null;

        if (bungieAccountId) {
          const res = await usersRouterCaller({
            prisma,
            session,
          }).getByBungieAccountId({ bungieAccountId });
          if (res) authUser = res.user;
        }

        const where = {
          ...(onlyLiked
            ? {
                likes: {
                  some: {
                    likedByUserId: userId,
                  },
                },
              }
            : { authorId: userId }),
        } satisfies Prisma.LoadoutFindManyArgs["where"];

        const orderBy = {
          createdAt: "desc",
        } satisfies Prisma.LoadoutFindManyArgs["orderBy"];

        const {
          items: loadouts,
          hasMore,
          nextPage,
        } = await paginate({
          take: cursor.take,
          skip: cursor.skip,
          count: () => prisma.loadout.count({ where, orderBy }),
          query: (paginateArgs) =>
            prisma.loadout.findMany({
              ...paginateArgs,
              where,
              orderBy,
              include: LoadoutIncludeCommon({
                includeAuthor: onlyLiked,
                authUserId: authUser?.id,
              }),
            }),
        });

        const manifestCaller = destinyLatestManifestRouterCaller({
          prisma,
          session,
        });

        const previewItemHashes = loadouts
          .map((loadout) =>
            getLoadoutItemHashes(
              loadout.items as unknown as Record<string, LoadoutItem>
            )
          )
          .flat();

        const inventoryItems = await manifestCaller.getTableComponents({
          tableName: "DestinyInventoryItemDefinition",
          locale: "en",
          hashIds: [...new Set(previewItemHashes)],
        });

        return {
          hasMore,
          nextPage,
          loadouts,
          inventoryItems:
            formatPrismaDestinyManifestTableComponents<
              Record<string, DestinyInventoryItemDefinition>
            >(inventoryItems),
        };
      }
    ),
  feed: publicProcedure
    .input(
      z.object({
        classTypes: z.array(z.nativeEnum(DestinyClassType)).optional(),
        subclassTypes: z.array(z.nativeEnum(DestinyDamageType)).optional(),
        tags: z.array(z.nativeEnum(LoadoutTag)).optional(),
        cursor: cursorValidation,
        section: z.enum(["ALL", "FOLLOWING"]).default("ALL"),
        sortBy: z.enum(["LATEST", "POPULAR"]).default("POPULAR"),
        popularDuring: z
          .enum(["TODAY", "WEEK", "MONTH", "ALL_TIME"])
          .default("MONTH"),
      })
    )
    .query(
      async ({
        input: {
          cursor = { take: 10, skip: 0 },
          sortBy,
          classTypes,
          subclassTypes,
          tags,
          popularDuring,
          section,
        },
        ctx: { prisma, session },
      }) => {
        if (!session && section === "FOLLOWING")
          throw new TRPCError({ code: "UNAUTHORIZED" });

        const bungieAccountId = session?.user.id;

        let authUser: User | null = null;

        if (bungieAccountId) {
          const res = await usersRouterCaller({
            prisma,
            session,
          }).getByBungieAccountId({ bungieAccountId });
          if (res) authUser = res.user;
        }

        const popularDuringDate =
          sortBy === "POPULAR" && popularDuring !== "ALL_TIME"
            ? getPopularDuringDate(popularDuring)
            : null;

        const where = {
          ...(classTypes &&
            classTypes.length > 0 && {
              classType: {
                in: classTypes,
              },
            }),
          ...(subclassTypes &&
            subclassTypes.length > 0 && {
              subclassType: {
                in: subclassTypes,
              },
            }),
          ...(tags &&
            tags.length > 0 && {
              tags: {
                some: {
                  tag: {
                    in: tags,
                  },
                },
              },
            }),
          ...(authUser &&
            section === "FOLLOWING" && {
              author: {
                followers: {
                  some: {
                    followerUserId: authUser.id,
                  },
                },
              },
            }),
          createdAt:
            sortBy === "POPULAR" && popularDuringDate
              ? {
                  gte: popularDuringDate,
                  lt: new Date(),
                }
              : void 0,
        } satisfies Prisma.LoadoutFindManyArgs["where"];

        const orderBy = (
          sortBy === "POPULAR"
            ? {
                likes: {
                  _count: "desc",
                },
              }
            : {
                createdAt: "desc",
              }
        ) satisfies Prisma.LoadoutFindManyArgs["orderBy"];

        const {
          items: loadouts,
          hasMore,
          nextPage,
        } = await paginate({
          take: cursor.take,
          skip: cursor.skip,
          count: () => prisma.loadout.count({ where, orderBy }),
          query: (paginateArgs) =>
            prisma.loadout.findMany({
              ...paginateArgs,
              where,
              orderBy,
              include: LoadoutIncludeCommon({
                includeAuthor: true,
                authUserId: authUser?.id,
              }),
            }),
        });

        const manifestCaller = destinyLatestManifestRouterCaller({
          prisma,
          session,
        });

        const previewItemHashes = loadouts
          .map((loadout) =>
            getLoadoutItemHashes(
              loadout.items as unknown as Record<string, LoadoutItem>
            )
          )
          .flat();

        const inventoryItems = await manifestCaller.getTableComponents({
          tableName: "DestinyInventoryItemDefinition",
          locale: "en",
          hashIds: [...new Set(previewItemHashes)],
        });

        return {
          loadouts,
          inventoryItems:
            formatPrismaDestinyManifestTableComponents<
              Record<string, DestinyInventoryItemDefinition>
            >(inventoryItems),
          hasMore,
          nextPage,
        };
      }
    ),
});
