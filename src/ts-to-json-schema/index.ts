import * as tsj from "ts-json-schema-generator";
import * as TsJsonSchemaGenerator from "./ts-json-schema-generator";
import type { JSONSchema7 } from "json-schema";
import * as Logger from "../logger";

export type GenerateJsonSchemaArgs = TsJsonSchemaGenerator.GenerateJsonSchemaArgs;

export interface GenearateJsonSchema {
  jsonSchema: JSONSchema7 | undefined;
  errorMessage?: string;
}

export const generateJsonSchema = (args: GenerateJsonSchemaArgs): GenearateJsonSchema => {
  try {
    if (args.typeName.isUnknown) {
      return {
        jsonSchema: undefined,
        errorMessage: "Unsupport Types",
      };
    }
    const jsonSchema = TsJsonSchemaGenerator.generate(args);
    Logger.log(jsonSchema);
    return {
      jsonSchema,
    };
  } catch (error) {
    const e = error as Error;
    Logger.error(e.stack);
    if (e instanceof tsj.NoRootTypeError) {
      const typeName = args.typeName.firstTypeName;
      return {
        jsonSchema: undefined,
        errorMessage: `"${typeName}" was not found. Please export "${typeName}".`,
      };
    }
    return {
      jsonSchema: undefined,
      errorMessage: e.message,
    };
  }
};
