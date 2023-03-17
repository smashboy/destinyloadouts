import AuthModule from "./AuthModule";
import CharactersModule from "./CharactersModule";
import FetchModule from "./FetchModule";
import ManifestModule from "./ManifestModule";
import ProfileModule from "./ProfileModule";
import { DestinyApiClientProps } from "./types";

export default class DestinyApiClient {
  private readonly fetch: FetchModule;
  readonly auth: AuthModule;
  readonly characters: CharactersModule;
  readonly profile: ProfileModule;
  readonly manifest: ManifestModule;

  constructor({ apiKey }: DestinyApiClientProps) {
    this.fetch = new FetchModule({ "X-API-Key": apiKey });
    this.auth = new AuthModule({ fetch: this.fetch });
    this.characters = new CharactersModule({
      fetch: this.fetch,
      auth: this.auth,
    });
    this.profile = new ProfileModule({ fetch: this.fetch });
    this.manifest = new ManifestModule({ fetch: this.fetch });
  }

  setAuthToken(token: string) {
    this.fetch.setAuthToken(token);
  }
}
