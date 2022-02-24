import * as ts from "typescript";
import { LineAndColumnComputer } from "./LineAndColumnComputer";
import { getSelectArea } from "./GetSelectArea";
import { search } from "./SearchDescendants";

export interface MatchRange {
  node: ts.Node;
  start: number;
}

export interface EditorPosition {
  lineNumber: number;
  column: number;
}

export interface DetectorContext {
  sourceFile: ts.SourceFile;
  lineAndColumnComputer: LineAndColumnComputer;
  lineNumber: number;
  columNumber: number;
}

export class Detector {
  public readonly bestMatchNode: ts.Node;

  constructor(readonly context: DetectorContext) {
    const start = this.context.lineAndColumnComputer.getPosFromLineAndColumn(context.lineNumber, context.columNumber);

    this.bestMatchNode = search({
      sourceFile: this.context.sourceFile,
      range: [start, start],
    });
  }

  public get area() {
    return getSelectArea(this.context.sourceFile, this.bestMatchNode, this.context.lineAndColumnComputer);
  }

  public getNodeArea = (node: ts.Node) => {
    return getSelectArea(this.context.sourceFile, node, this.context.lineAndColumnComputer);
  };
}
