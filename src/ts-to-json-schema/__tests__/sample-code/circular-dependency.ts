export interface File {
  name: string;
}

export type Child = File | Directory;

export interface Directory {
  children: Child[];
}
