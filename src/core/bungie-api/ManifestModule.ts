import BaseModule from "./BaseModule";
import { bungieNetOrigin } from "./consants";
import { DestinyManifest } from "./types";

export default class ManifestModule extends BaseModule {
  get() {
    console.log("GET MANIFEST");
    return this.fetch.get<DestinyManifest>("/Destiny2/Manifest");
  }

  // getEntityDefinition(type: string, hash: number) {
  //   return this.fetch.get(`/Destiny2/Manifest/${type}/${hash}/`);
  // }

  async getDestinyContentFromUrl<T>(path: string) {
    const response = await fetch(`${bungieNetOrigin}${path}`);

    if (!response.ok) {
      console.log("FETCH ERROR", response.status, response.statusText);
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as T;

    return data;
  }
}
