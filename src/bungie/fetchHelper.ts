import { type HttpClientConfig } from "bungie-api-ts/http";
import { env } from "~/env.mjs";

export const bungieApiFetchHelper =
  (accessToken?: string) => async (config: HttpClientConfig) => {
    const { url, method, params } = config;

    let urlWithParams = url;

    if (config.params) {
      // strip out undefined params keys. bungie-api-ts creates them for optional endpoint parameters
      for (const key in params) {
        typeof params[key] === "undefined" && delete config.params[key];
      }
      urlWithParams = `${url}?${new URLSearchParams(
        config.params as Record<string, string>
      ).toString()}`;
    }

    const headers = {
      "X-API-Key": env.BUNGIE_API_KEY,
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };

    console.log("BUNGIE API REQUEST:", { headers, config, params });

    const response = await fetch(urlWithParams, {
      method,
      headers,
    });

    if (!response.ok) {
      console.log("FETCH ERROR", response.status, response.statusText);
      throw new Error(response.statusText);
    }

    const data = await response.json();

    return data;
  };
