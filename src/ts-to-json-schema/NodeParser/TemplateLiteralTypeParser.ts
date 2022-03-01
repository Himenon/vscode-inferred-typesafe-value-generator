import { TemplateLiteralType } from "../Type/TemplateLiteralType";
import { BaseType, SubNodeParser, Context, ReferenceType } from "ts-json-schema-generator";
import * as ts from "typescript";

export class TemplateLiteralTypeParser implements SubNodeParser {
  public supportsNode(node: ts.Node): node is ts.TemplateLiteral {
    return node.kind === ts.SyntaxKind.TemplateLiteralType;
  }
  public createType(node: ts.Node, context: Context, reference?: ReferenceType): BaseType {
    return new TemplateLiteralType({
      fullText: node.getText(),
    });
  }
}
