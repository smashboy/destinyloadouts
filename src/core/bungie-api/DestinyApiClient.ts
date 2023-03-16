import AuthModule from "./AuthModule";
import CharactersModule from "./CharactersModule";
import FetchModule from "./FetchModule";
import ProfileModule from "./ProfileModule";
import { DestinyApiClientProps } from "./types";

export default class DestinyApiClient {
  private readonly fetch: FetchModule;
  readonly auth: AuthModule;
  readonly characters: CharactersModule;
  readonly profile: ProfileModule;

  constructor({ apiKey }: DestinyApiClientProps) {
    this.fetch = new FetchModule({ "X-API-Key": apiKey });
    this.auth = new AuthModule();
    this.characters = new CharactersModule({ fetch: this.fetch });
    this.profile = new ProfileModule({ fetch: this.fetch });
  }
}
