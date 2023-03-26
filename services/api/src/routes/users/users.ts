import { z } from "zod";
import { createRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { prisma } from "../../../prisma/client";

export const usersRoutes = createRouter({
  getById: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input: { userId } }) => {
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
    .query(async ({ input: { bungieAccountId } }) => {
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
          authorizedUser: { id: userId },
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
});
