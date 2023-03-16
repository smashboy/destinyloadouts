import AuthModule from "./AuthModule";
import BaseModule, { BaseModuleProps } from "./BaseModule";

interface ProtectedModuleProps extends BaseModuleProps {
  auth: AuthModule;
}

export default class ProtectedModule extends BaseModule {
  protected readonly auth: AuthModule;

  constructor({ auth, fetch }: ProtectedModuleProps) {
    super({ fetch });

    this.auth = auth;
  }
}
