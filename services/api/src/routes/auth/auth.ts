import { z } from "zod";
import { createRouter, publicProcedure } from "../../trpc";
import { prisma } from "../../../prisma/client";

export const authRoutes = createRouter({
  upsertUser: publicProcedure
    .input(
      z.object({
        bungieAccountId: z.string(),
      })
    )
    .mutation(({ input: { bungieAccountId } }) =>
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
