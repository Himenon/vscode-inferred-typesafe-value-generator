export const codeFormat = (source: string): string => {
  try {
    require.resolve("prettier");
    const prettier = require("prettier");
    return prettier.format(source, { parser: "babel" });
  } catch (e) {
    return source;
  }
};
