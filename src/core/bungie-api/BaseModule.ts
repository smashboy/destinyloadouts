import FetchModule from "./FetchModule";

export interface BaseModuleProps {
  fetch: FetchModule;
}

export default class BaseModule {
  protected readonly fetch: FetchModule;

  constructor({ fetch }: BaseModuleProps) {
    this.fetch = fetch;
  }
}
