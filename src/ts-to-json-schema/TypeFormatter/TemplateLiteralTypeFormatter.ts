import { TemplateLiteralType } from "../Type/TemplateLiteralType";
import { BaseType, Definition, SubTypeFormatter } from "ts-json-schema-generator";

export class TemplateLiteralTypeFormatter implements SubTypeFormatter {
  public constructor(private typeFormatter: SubTypeFormatter) {}

  private getTypeFormatter(type: TemplateLiteralType): SubTypeFormatter {
    if (this.typeFormatter.supportsType(type)) {
      return this.typeFormatter;
    }
    throw new Error(`${type}`);
  }

  public getChildren(type: TemplateLiteralType): BaseType[] {
    const children = this.getTypeFormatter(type).getChildren(type);
    return children;
  }

  public supportsType(type: TemplateLiteralType): boolean {
    return type instanceof TemplateLiteralType;
  }

  public getDefinition(type: TemplateLiteralType): Definition {
    return { type: "string" };
  }
}
