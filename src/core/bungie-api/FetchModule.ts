import { DestinyApiHeaders } from "./types";

export default class FetchModule {
  private readonly apiUrl = "https://www.bungie.net/Platform";
  private readonly headers: DestinyApiHeaders;

  constructor(headers: DestinyApiHeaders) {
    this.headers = headers;
  }

  async get(endpoint: string) {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      headers: this.headers,
    });

    return response.json();
  }
}
