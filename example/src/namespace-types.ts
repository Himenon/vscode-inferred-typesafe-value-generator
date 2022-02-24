namespace Sample {
  export interface Config {
    name?: string;
    value: "a" | "b" | "c";
  }
}

export const config: Sample.Config = {
  name: "",
  value: "a",
};
