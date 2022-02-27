export interface ServiceA {
  url: string;
}
export interface ServerSideConfig {
  name: string;

  service_a?: ServiceA;

  service_b: {
    url: "https://dev.example.com" | "https://prod.example.com/b";
    apiToken?: string;
    timeout: number;
  };
}
