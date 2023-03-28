import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  upsertUser: publicProcedure
    .input(
      z.object({
        bungieAccountId: z.string(),
      })
    )
    .mutation(({ input: { bungieAccountId }, ctx: { prisma } }) =>
      prisma.user.upsert({
        where: {
          bungieAccountId,
        },
        update: {
          bungieAccountId,
        },
        create: {
          bungieAccountId,
        },
      })
    ),
});
