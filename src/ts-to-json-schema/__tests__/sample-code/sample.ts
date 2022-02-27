import * as Types from "./types";
import * as Service1 from "./service1-types";
import * as Service2 from "./service2-types";

export type ServerSideConfig = Types.ServerSideConfig;

export interface SameTypeConfig {
  service1: Service1.Config;
  service2: Service2.Config;
}
