import * as ts from "typescript";
import { getStartSafe } from "./getStartSafe";

export type Range = [number, number];

const forEachChild = (node: ts.Node) => {
  const nodes: ts.Node[] = [];
  node.forEachChild((child) => {
    nodes.push(child);
    return undefined;
  });
  return nodes;
};

const isBeforeRange = (pos: number, range: Range) => {
  return pos < range[0];
};

const isAfterRange = (nodeEnd: number, range: Range) => {
  return nodeEnd >= range[0] && nodeEnd > range[1];
};

interface MatchRange {
  node: ts.Node;
  start: number;
}

export interface SearchArgs {
  sourceFile: ts.SourceFile;
  range: Range;
}

export const search = ({ sourceFile, range }: SearchArgs): ts.Node => {
  let bestMatch: MatchRange = {
    node: sourceFile,
    start: sourceFile.getStart(sourceFile),
  };

  const searchDescendants = (node: ts.Node) => {
    const children = forEachChild(node);
    for (const child of children) {
      if (child.kind !== ts.SyntaxKind.SyntaxList) {
        if (isBeforeRange(child.end, range)) {
          continue;
        }

        const childStart = getStartSafe(child, sourceFile);

        if (isAfterRange(childStart, range)) {
          return;
        }

        const isEndOfFileToken = child.kind === ts.SyntaxKind.EndOfFileToken;
        const hasSameStart = bestMatch.start === childStart && range[0] === childStart;
        if (!isEndOfFileToken && !hasSameStart) {
          bestMatch = { node: child, start: childStart };
        }
      }

      searchDescendants(child);
    }
  };

  searchDescendants(sourceFile);

  return bestMatch.node;
};
