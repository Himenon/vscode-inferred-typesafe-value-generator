import type * as ts from "typescript";

export const getStartSafe = (node: ts.Node, sourceFile: ts.SourceFile) => {
  // workaround for compiler api bug with getStart(sourceFile, true) (see PR #35029 in typescript repo)
  const jsDocs = (node as any).jsDoc as ts.Node[] | undefined;
  if (jsDocs && jsDocs.length > 0) {
    return jsDocs[0].getStart(sourceFile);
  }
  return node.getStart(sourceFile);
};
