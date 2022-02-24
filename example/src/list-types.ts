export const Fruit = "Fruit" as const;

export const Bug = "bug" as const;

export type Kind = typeof Fruit | typeof Bug;

export type Item = {
  kind: Kind;
  weight: number;
};

export type ExtraType = {
  hoge: string;
};

export const list: Item[] = [service, { kind: "Fruit", weight: 100 }, { kind: "bug", weight: 0 }];
