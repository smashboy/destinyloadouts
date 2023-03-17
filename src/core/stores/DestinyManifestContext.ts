"use client";
import { DestinyManifest } from "../bungie-api/types";
import { createContextStore } from "./createContextStore";

export const [DestinyManifestProvider, useDestinyManifest] =
  createContextStore<DestinyManifest>("DestinyManifest");
