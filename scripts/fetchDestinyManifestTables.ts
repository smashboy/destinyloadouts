import * as dotenv from "dotenv";
import { bungieApiFetchHelper } from "@/core/bungie-api/fetchHelper";
import {
  getDestinyManifest,
  getDestinyManifestSlice,
} from "bungie-api-ts/destiny2";
import { writeFile } from "fs/promises";
import path from "path";
import { destinyManifestTableNames } from "@/core/bungie-api/consants";

dotenv.config();

const run = async () => {
  const fetchHelper = bungieApiFetchHelper();

  const manifest = await getDestinyManifest(fetchHelper);

  const slices = await getDestinyManifestSlice(fetchHelper, {
    destinyManifest: manifest.Response,
    tableNames: destinyManifestTableNames,
    language: "en",
  });

  await Promise.all(
    destinyManifestTableNames.map((name) =>
      writeFile(
        path.join("./public/destiny-manifest-tables", `${name}.json`),
        JSON.stringify(slices[name])
      )
    )
  );
};

run();
