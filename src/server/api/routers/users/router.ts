import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input: { userId }, ctx: { prisma } }) => {
      const [user, loadoutsCount, followersCount, likesCount] =
        await Promise.all([
          prisma.user.findFirst({
            where: {
              id: userId,
            },
          }),
          prisma.loadout.count({
            where: {
              authorId: userId,
            },
          }),
          prisma.userFollower.count({
            where: {
              followingUserId: userId,
            },
          }),
          prisma.loadoutLike.count({
            where: {
              likedByUserId: userId,
            },
          }),
        ]);

      if (!user) return null;

      return {
        user,
        loadoutsCount,
        followersCount,
        likesCount,
      };
    }),
  getByBungieAccountId: publicProcedure
    .input(
      z.object({
        bungieAccountId: z.string(),
      })
    )
    .query(async ({ input: { bungieAccountId }, ctx: { prisma } }) => {
      const user = await prisma.user.findFirst({
        where: {
          bungieAccountId,
        },
      });

      if (!user) return null;

      const [loadoutsCount, followersCount, likesCount] = await Promise.all([
        prisma.loadout.count({
          where: {
            authorId: user.id,
          },
        }),
        prisma.userFollower.count({
          where: {
            followingUserId: user.id,
          },
        }),
        prisma.loadoutLike.count({
          where: {
            likedByUserId: user.id,
          },
        }),
      ]);

      return {
        user,
        loadoutsCount,
        followersCount,
        likesCount,
      };
    }),
  follow: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({
        input: { followingUserId },
        ctx: {
          prisma,
          session: {
            user: { id: userId },
          },
        },
      }) => {
        const where = {
          followingUserId_followerUserId: {
            followingUserId,
            followerUserId: userId,
          },
        };

        const follow = await prisma.userFollower.findUnique({
          where,
        });

        return follow
          ? prisma.userFollower.delete({
              where,
            })
          : prisma.userFollower.create({
              data: {
                following: {
                  connect: {
                    id: followingUserId,
                  },
                },
                follower: {
                  connect: {
                    id: userId,
                  },
                },
              },
            });
      }
    ),
  isFollowing: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .query(
      ({
        input: { followingUserId },
        ctx: {
          prisma,
          session: {
            user: { id: userId },
          },
        },
      }) =>
        prisma.userFollower.findUnique({
          where: {
            followingUserId_followerUserId: {
              followingUserId,
              followerUserId: userId,
            },
          },
        })
    ),
});

export const usersRouterCaller = usersRouter.createCaller;
