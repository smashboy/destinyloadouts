"use client";
import { DestinyCharacterLoadout } from "../bungie-api/types";
import { createContextStore } from "./createContextStore";

export const [LoadoutsContext, useLoadouts] =
  createContextStore<DestinyCharacterLoadout[]>("Loadouts");
