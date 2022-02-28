export interface Tag {
  name: string;
}

export interface MyService {
  id: string;
  version?: string;
  tags: Tag[];
}

export interface Config {
  service: MyService;
}
