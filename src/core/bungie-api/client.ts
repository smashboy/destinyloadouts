import DestinyApiClient from "./DestinyApiClient";

export const destinyClient = new DestinyApiClient({
  apiKey: process.env.BUNGIE_API_KEY!,
});
