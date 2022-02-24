export interface MyObject {
  name: string;
  sample: {
    [key: string]: string;
  };
  sample2: Record<string, string>;
}

const obj: MyObject = {
  name: "",
  sample: {},
  sample2: {},
};
