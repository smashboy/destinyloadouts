import { bungieNetOrigin } from "./consants";
import { BungieNetApiResponse, DestinyApiHeaders } from "./types";

export default class FetchModule {
  private readonly apiUrl = `${bungieNetOrigin}/Platform`;
  private readonly headers: DestinyApiHeaders;

  constructor(headers: DestinyApiHeaders) {
    this.headers = headers;
    // this.headers["Content-Type"] = "application/json";
    // this.headers["Accept"] = "application/json";
  }

  async get<T>(endpoint: string) {
    console.log("FETCH", `${this.apiUrl}${endpoint}`);
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      headers: this.headers,
    });

    if (!response.ok) {
      console.log("FETCH ERROR", response.status, response.statusText);
      throw new Error(response.statusText);
    }

    const data = (await response.json()) as BungieNetApiResponse<T>;

    return data.Response;
  }

  setAuthToken(token: string) {
    this.headers.Authorization = `Bearer ${token}`;
  }
}
