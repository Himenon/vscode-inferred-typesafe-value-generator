import { FunctionType } from "../Type/FunctionType";
import { BaseType, SubNodeParser, Context, ReferenceType } from "ts-json-schema-generator";
import * as ts from "typescript";

export class FunctionNodeParser implements SubNodeParser {
  public supportsNode(node: ts.FunctionTypeNode): boolean {
    return node.kind === ts.SyntaxKind.FunctionType;
  }
  public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
    return new FunctionType({
      fullText: node.getFullText(),
    });
  }
}
