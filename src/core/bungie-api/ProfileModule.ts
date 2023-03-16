import BaseModule from "./BaseModule";

export default class ProfileModule extends BaseModule {
  async getById(id: string) {
    return this.fetch.get(`/User/GetBungieNetUserById/${id}`);
  }
}
