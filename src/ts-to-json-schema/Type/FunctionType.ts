import { BaseType } from "ts-json-schema-generator";

export interface Params {
  fullText: string;
}

export class FunctionType extends BaseType {
  constructor(public readonly params: Params) {
    super();
  }
  public getId(): string {
    return "function";
  }
}
