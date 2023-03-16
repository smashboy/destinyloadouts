import FetchModule from "./FetchModule";

interface BaseModuleProps {
  fetch: FetchModule;
}

export default class BaseModule {
  protected readonly fetch: FetchModule;

  constructor({ fetch }: BaseModuleProps) {
    this.fetch = fetch;
  }
}
