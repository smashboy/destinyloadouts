import path from "path";
import { readFile } from "fs/promises";
import {
  DestinyManifestComponentName,
  DestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { destinyManifestDataFolderPath } from "./serverConfig";

export const getDestinyManifestTables = async <
  T extends DestinyManifestComponentName[]
>(
  tableNames: T
): Promise<DestinyManifestSlice<T>> => {
  const tablesContent = await Promise.all(
    tableNames.map((name) =>
      readFile(path.join(destinyManifestDataFolderPath, `${name}.json`), {
        encoding: "utf-8",
      })
    )
  );

  const list = tableNames.reduce(
    (acc, name, index) => ({
      ...acc,
      [name]: JSON.parse(tablesContent[index]),
    }),
    {}
  ) as DestinyManifestSlice<T>;

  return list;
};
