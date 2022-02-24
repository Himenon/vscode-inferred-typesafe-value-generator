import { Context, BaseType, SubNodeParser } from "ts-json-schema-generator";
import * as ts from "typescript";

export class DateParser implements SubNodeParser {
  public constructor() {}

  public supportsNode(node: ts.Identifier): boolean {
    return node.kind === ts.SyntaxKind.Identifier;
  }

  public createType(node: ts.Identifier, context: Context): BaseType | undefined {
    return undefined;
  }
}
