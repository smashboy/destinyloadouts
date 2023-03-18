"use client";
import { DestinyManifestSlice } from "bungie-api-ts/destiny2";
import { destinyManifestTableNames } from "../bungie-api/consants";
import { createContextStore } from "./createContextStore";

export const [DestinyManifestTablesContext, useDestinyManifestTables] =
  createContextStore<DestinyManifestSlice<typeof destinyManifestTableNames>>(
    "DestinyManifestTables"
  );
