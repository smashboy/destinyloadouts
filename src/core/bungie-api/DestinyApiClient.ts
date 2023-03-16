import AuthModule from "./AuthModule";
import CharactersModule from "./CharactersModule";
import FetchModule from "./FetchModule";
import { DestinyApiClientProps } from "./types";

export default class DestinyApiClient {
  private readonly fetch: FetchModule;
  readonly auth: AuthModule;
  readonly characters: CharactersModule;

  constructor({ apiKey }: DestinyApiClientProps) {
    this.fetch = new FetchModule({ "X-API-Key": apiKey });
    this.auth = new AuthModule();
    this.characters = new CharactersModule({ fetch: this.fetch });
  }
}
