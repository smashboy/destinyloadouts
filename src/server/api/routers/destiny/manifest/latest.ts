import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { destinyManifestLanguages } from "bungie-api-ts/destiny2";
import {
  createTRPCMiddleware,
  publicProcedure,
  createTRPCRouter,
} from "~/server/api/trpc";
import { destinyManifestTableNames } from "~/bungie/constants";

const latestDestinyManifestProcedure = publicProcedure.use(
  createTRPCMiddleware(async ({ next, ctx: { prisma } }) => {
    const latestManifest = await prisma.destinyManifest.findFirst({});

    if (!latestManifest) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return next({
      ctx: {
        manifest: latestManifest,
      },
    });
  })
);

export const destinyLatestManifestRouter = createTRPCRouter({
  getLocaleTable: latestDestinyManifestProcedure
    .input(
      z.object({
        locale: z.enum(destinyManifestLanguages),
      })
    )
    .query(({ input: { locale }, ctx: { manifest, prisma } }) =>
      prisma.destinyManifestTablesByLocale.findUnique({
        where: {
          locale_manifestVersion: {
            locale,
            manifestVersion: manifest.version,
          },
        },
        include: {
          tables: {
            include: {
              components: true,
            },
          },
        },
      })
    ),
  getTable: latestDestinyManifestProcedure
    .input(
      z.object({
        name: z.enum(destinyManifestTableNames),
        locale: z.enum(destinyManifestLanguages),
      })
    )
    .query(({ input: { locale, name }, ctx: { manifest, prisma } }) =>
      prisma.destinyManifestTable.findUnique({
        where: {
          name_localeName_manifestVersion: {
            name,
            localeName: locale,
            manifestVersion: manifest.version,
          },
        },
        include: {
          components: true,
        },
      })
    ),
  getTableComponent: latestDestinyManifestProcedure
    .input(
      z.object({
        tableName: z.enum(destinyManifestTableNames),
        locale: z.enum(destinyManifestLanguages),
        hashId: z.string(),
      })
    )
    .query(
      ({ input: { locale, tableName, hashId }, ctx: { manifest, prisma } }) =>
        prisma.destinyManifestTableComponent.findUnique({
          where: {
            hashId_tableName_localeName_manifestVersion: {
              hashId,
              tableName,
              localeName: locale,
              manifestVersion: manifest.version,
            },
          },
        })
    ),
  getTableComponents: latestDestinyManifestProcedure
    .input(
      z.object({
        tableName: z.enum(destinyManifestTableNames),
        locale: z.enum(destinyManifestLanguages),
        hashIds: z.array(z.string()),
      })
    )
    .query(
      ({ input: { tableName, locale, hashIds }, ctx: { manifest, prisma } }) =>
        prisma.destinyManifestTableComponent.findMany({
          where: {
            AND: [
              {
                manifestVersion: manifest.version,
              },
              {
                localeName: locale,
              },
              { tableName },
              {
                hashId: {
                  in: hashIds,
                },
              },
            ],
          },
        })
    ),
});

export const destinyLatestManifestRouterCaller =
  destinyLatestManifestRouter.createCaller;
