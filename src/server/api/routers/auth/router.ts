import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  getMe: protectedProcedure.query(
    ({
      ctx: {
        session: { user },
      },
    }) => user
  ),
  // upsertUser: publicProcedure
  //   .input(
  //     z.object({
  //       bungieAccountId: z.string(),
  //     })
  //   )
  //   .mutation(({ input: { bungieAccountId }, ctx: { prisma } }) =>
  //     prisma.user.upsert({
  //       where: {
  //         bungieAccountId,
  //       },
  //       update: {
  //         bungieAccountId,
  //       },
  //       create: {
  //         bungieAccountId,
  //       },
  //     })
  //   ),
});
