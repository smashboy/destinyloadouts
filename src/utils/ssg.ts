import { type Session } from "next-auth";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

export const trpsSSG = (session: Session) =>
  createProxySSGHelpers({
    router: appRouter,
    ctx: { session, prisma },
  });

export type TrpcSSG = ReturnType<typeof trpsSSG>;
