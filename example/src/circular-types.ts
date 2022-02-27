export interface File {
  name: string;
}
export interface Directory {
  name: string;
  children: (Directory | File)[];
}

const directory: Directory = {
  name: "",
  children: [{ name: "", children: [] }],
};
