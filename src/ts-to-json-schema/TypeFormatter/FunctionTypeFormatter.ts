import { FunctionType } from "../Type/FunctionType";
import { BaseType, Definition, SubTypeFormatter } from "ts-json-schema-generator";

export class FunctionTypeFormatter implements SubTypeFormatter {
  public constructor(private typeFormatter: SubTypeFormatter) {}

  private getTypeFormatter(type: FunctionType): SubTypeFormatter {
    if (this.typeFormatter.supportsType(type)) {
      return this.typeFormatter;
    }
    throw new Error(`${type}`);
  }

  public getChildren(type: FunctionType): BaseType[] {
    const children = this.getTypeFormatter(type).getChildren(type);
    return children;
  }

  public supportsType(type: FunctionType): boolean {
    return type instanceof FunctionType;
  }

  public getDefinition(type: FunctionType): Definition {
    return {
      type: "object",
      format: "function",
    };
  }
}
