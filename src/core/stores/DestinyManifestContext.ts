"use client";
import { DestinyManifest } from "bungie-api-ts/destiny2";
import { createContextStore } from "./createContextStore";

export const [DestinyManifestProvider, useDestinyManifest] =
  createContextStore<DestinyManifest>("DestinyManifest");
