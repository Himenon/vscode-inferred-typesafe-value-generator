export interface MyObject {
  name: string;
  sample: {
    [key: string]: string;
  };
  sample2: Record<string, string>;
  pureObject: object;
}

const obj: MyObject = {
  name: "",
  sample: {},
  sample2: {},
  pureObject: {},
};

export interface OptionalObject {
  a?: {
    "b-c"?: {
      d?: string;
    };
  };
}

interface SecondObject {
  value: string;
}

const optionalObject: OptionalObject = {};

const secondObject: SecondObject = {
  value: optionalObject.a["b-c"]?.d,
};
