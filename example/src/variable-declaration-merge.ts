export interface Service {
  name: string;
  url: string;
}

export interface Config {
  service: Service;
  exraService: Service;
  list: string[];
}

const service: Service = {
  name: "",
  url: "",
};

export const config: Config = {
  service: service,
  exraService: { name: "", url: "" },
  list: [],
};
