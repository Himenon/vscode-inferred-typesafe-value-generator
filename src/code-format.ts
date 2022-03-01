import { format } from "prettier";
export const codeFormat = (source: string): string => {
  try {
    return format(source, { parser: "babel-ts", printWidth: 54 });
  } catch (e) {
    return source;
  }
};
