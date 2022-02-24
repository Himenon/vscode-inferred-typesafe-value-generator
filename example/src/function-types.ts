export type CallbackArgs = {
  value: string;
};

export type SyncFunc = (args: CallbackArgs) => void;

export type AsyncFunc = (args: CallbackArgs) => Promise<number>;

export interface MyObject {
  syncFunc: SyncFunc;
  asyncFunc: AsyncFunc;
}

export interface RootObject {
  myObject: MyObject;
}

export const value: RootObject = {
  myObject: {},
};
