export interface Config {
  type: string | AppenderModule;
  [key: string]: any;
}

export interface AppenderModule {
  configure: Function;
}
