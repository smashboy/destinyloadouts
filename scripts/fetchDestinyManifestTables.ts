import * as dotenv from "dotenv";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import {
  getDestinyManifest,
  getDestinyManifestSlice,
  DestinyManifestComponentName,
} from "bungie-api-ts/destiny2";
import { writeFile } from "fs/promises";
import path from "path";

dotenv.config();

const tableNames: DestinyManifestComponentName[] = [
  "DestinyLoadoutNameDefinition",
  "DestinyLoadoutColorDefinition",
  "DestinyLoadoutIconDefinition",
  "DestinyInventoryItemDefinition",
];

const run = async () => {
  const fetchHelper = bungieApiFetchHelper();

  const manifest = await getDestinyManifest(fetchHelper);

  const slices = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: manifest.Response,
    tableNames,
    language: "en",
  });

  await Promise.all(
    tableNames.map((name) =>
      writeFile(
        path.join("./public/destiny-manifest-data", `${name}.json`),
        JSON.stringify(slices[name])
      )
    )
  );
};

run();
