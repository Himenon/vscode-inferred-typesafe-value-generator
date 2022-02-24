export interface Sample<T> {
  kind: T;
}

export type ObjectType = {
  name: string;
  age: number;
};

export type MyType = Sample<ObjectType>;

export const value: MyType = {
  kind: {
    name: "",
    age: 0,
  },
};
