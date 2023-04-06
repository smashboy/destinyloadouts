import * as dotenv from "dotenv";
import {
  type DestinyManifestLanguage,
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { bungieApiFetchHelper } from "~/bungie/fetchHelper";
import { destinyManifestTableNames } from "~/bungie/constants";
import { prisma, type Prisma } from "./client";

const BATCH_SIZE = 100;

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
dotenv.config();

const language: DestinyManifestLanguage = "en";

const run = async () => {
  !process.env.SKIP_ENV_VALIDATION && (await import("../src/env.mjs"));

  const fetchHelper = bungieApiFetchHelper();

  const manifestResponse = await getDestinyManifest(fetchHelper);
  const manifestData = manifestResponse.Response;

  const { version } = manifestData;

  console.log("Fetching manifest slices...");

  const slices = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: manifestData,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tableNames: destinyManifestTableNames,
    language,
  });

  console.log(`Slices fetched: ${Object.keys(slices).length}`);
  console.log("Creating new manifest...");

  await prisma.destinyManifest.create({
    data: {
      version,
    },
  });

  console.log("New manifest created successfully!");
  console.log("Creating new manifest tables locale...");

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

  console.log("New manifest tables locale created successfully!");
  console.log("Creating new manifest tables...");

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

  console.log("New manifest tables created successfully!");

  const componentBatchQueries: Prisma.DestinyManifestTableComponentCreateArgs[][] =
    [];

  for (const [tableName, list] of Object.entries(slices)) {
    let chunk: Prisma.DestinyManifestTableComponentCreateArgs[] = [];

    const listItems = Object.entries(list);

    for (const index in listItems) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [hashId, item] = listItems[index]!;

      const query = {
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
      } satisfies Prisma.DestinyManifestTableComponentCreateArgs;

      chunk.push(query);

      if (
        chunk.length === BATCH_SIZE ||
        Number(index) === listItems.length - 1
      ) {
        componentBatchQueries.push(chunk);
        chunk = [];
      }
    }
  }

  const totalBatchQueriesCount = componentBatchQueries.flat().length;
  let completedBatchQueriesCount = 0;

  console.log("TOTAL QUERIES COUNT:", totalBatchQueriesCount);
  console.log(
    "EXPECTED COUNT:",
    Object.entries(slices)
      .map(([, list]) => Object.values(list))
      .flat().length
  );

  for (const queries of componentBatchQueries) {
    console.log("Components transaction start...");

    await prisma.$transaction(
      queries.map((query) => prisma.destinyManifestTableComponent.create(query))
    );

    completedBatchQueriesCount += queries.length;

    console.log(
      `[${completedBatchQueriesCount}/${totalBatchQueriesCount}]: Components transaction finished successfully!`
    );
  }
};

run();
