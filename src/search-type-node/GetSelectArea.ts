import type * as ts from "typescript";
import type { LineAndColumnComputer } from "./LineAndColumnComputer";
import { getStartSafe } from "./getStartSafe";

export interface CodeHighlightRange {
  start: number;
  end: number;
}

/**
 * HighlightRangeを計算
 */
export const getCodeHighlightRange = (sourceFile: ts.SourceFile, selectedNode: ts.Node): CodeHighlightRange | undefined => {
  if (selectedNode === sourceFile) {
    return undefined;
  }
  return {
    start: getStartSafe(selectedNode, sourceFile),
    end: selectedNode.end,
  };
};

export interface SelectArea {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export const getSelectArea = (
  sourceFile: ts.SourceFile,
  selectedNode: ts.Node,
  lineAndColumnComputer: LineAndColumnComputer
): SelectArea | undefined => {
  const highlight = getCodeHighlightRange(sourceFile, selectedNode);
  if (!highlight) {
    return;
  }
  const startInfo = lineAndColumnComputer.getNumberAndColumnFromPos(highlight.start);
  const endInfo = lineAndColumnComputer.getNumberAndColumnFromPos(highlight.end);
  const range: SelectArea = {
    startLineNumber: startInfo.lineNumber,
    startColumn: startInfo.column,
    endLineNumber: endInfo.lineNumber,
    endColumn: endInfo.column,
  };

  return range;
};
