import * as Types from "./types";
import * as Types2 from "./tsx-types";

type RootConfig = Types.RootConfig;

export const config: RootConfig = {
  pubsub: {
    name: "",
  },
  email: {
    name: "",
  },
};

export type Props1 = Types.Props;

export const props1: Props1 = {
  myId: "",
};

export type RootConfig2 = Types2.Props;

export const config2: RootConfig2 = {};
