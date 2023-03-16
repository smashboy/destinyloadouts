import BaseModule from "./BaseModule";
import { BungieNetUser } from "./types";

export default class ProfileModule extends BaseModule {
  async getById(id: string) {
    return this.fetch.get<BungieNetUser>(`/User/GetBungieNetUserById/${id}`);
  }
}
