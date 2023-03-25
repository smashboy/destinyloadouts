"use client";
import { DestinyLoadoutComponent } from "bungie-api-ts/destiny2";
import { createContextStore } from "./createContextStore";

export const [LoadoutsContext, useLoadouts] =
  createContextStore<DestinyLoadoutComponent[]>("Loadouts");
