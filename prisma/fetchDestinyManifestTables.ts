import * as dotenv from "dotenv";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import {
  DestinyManifestLanguage,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { destinyManifestTableNames } from "@/core/bungie-api/consants";
import { prisma } from "./client";

dotenv.config();

const language: DestinyManifestLanguage = "en";

const run = async () => {
  const fetchHelper = bungieApiFetchHelper();

  const manifestResponse = await getDestinyManifest(fetchHelper);
  const manifestData = manifestResponse.Response;

  const { version } = manifestData;

  const slices = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: manifestData,
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
              hashId: Number(hashId),
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
