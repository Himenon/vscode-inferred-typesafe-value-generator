import * as ts from "typescript";
import { extname } from "path";

const getScriptKind = (filename: string): ts.ScriptKind | undefined => {
  const ext = extname(filename);
  switch (ext) {
    case ".ts":
      return ts.ScriptKind.TS;
    case ".tsx":
      return ts.ScriptKind.TSX;
    case ".js":
      return ts.ScriptKind.JS;
    case ".jsx":
      return ts.ScriptKind.JSX;
    default:
      return undefined;
  }
};

export const createSourceFile = (filename: string, code: string) => {
  const scriptKind = getScriptKind(filename);
  return ts.createSourceFile(filename, code, ts.ScriptTarget.ESNext, true, scriptKind);
};
