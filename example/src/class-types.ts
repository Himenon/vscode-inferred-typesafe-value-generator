export class MyObject {
  constructor(private id: number) {}
  public getId(): number {
    return this.id;
  }
  public getName(): string {
    return "name";
  }
}

export type RootObject = {
  myObject: MyObject;
};

const myObject: RootObject = {
  myObject: {},
};
