import * as dotenv from "dotenv";
import {
  type DestinyManifestLanguage,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { bungieApiFetchHelper } from "~/bungie/fetchHelper";
import { destinyManifestTableNames } from "~/bungie/constants";
import { prisma } from "./client";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
dotenv.config();

const language: DestinyManifestLanguage = "en";

const run = async () => {
  !process.env.SKIP_ENV_VALIDATION && (await import("../src/env.mjs"));

  const fetchHelper = bungieApiFetchHelper();

  const manifestResponse = await getDestinyManifest(fetchHelper);
  const manifestData = manifestResponse.Response;

  const { version } = manifestData;

  const slices = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: manifestData,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tableNames: destinyManifestTableNames,
    language,
  });

  await prisma.destinyManifest.create({
    data: {
      version,
    },
  });

  await prisma.destinyManifestTablesByLocale.create({
    data: {
      locale: language,
      manifest: {
        connect: {
          version,
        },
      },
    },
  });

  await prisma.$transaction(
    destinyManifestTableNames.map((tableName) =>
      prisma.destinyManifestTable.create({
        data: {
          name: tableName,
          locale: {
            connect: {
              locale_manifestVersion: {
                locale: language,
                manifestVersion: version,
              },
            },
          },
        },
      })
    )
  );

  await prisma.$transaction(
    Object.entries(slices)
      .map(([tableName, list]) =>
        Object.entries(list).map(([hashId, item]) =>
          prisma.destinyManifestTableComponent.create({
            data: {
              hashId,
              content: item,
              table: {
                connect: {
                  name_localeName_manifestVersion: {
                    name: tableName,
                    localeName: language,
                    manifestVersion: version,
                  },
                },
              },
            },
          })
        )
      )
      .flat()
  );
};

run();
