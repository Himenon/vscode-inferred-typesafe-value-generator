import type { JSONSchema7, JSONSchema7TypeName } from "json-schema";

export type Schema = JSONSchema7;

export type JSONSchemaTypeName = JSONSchema7TypeName;

export type JSONSchemaDefinition = Schema | boolean;

export interface Reference {
  $ref: string;
  summary?: string;
  description?: string;
}

export interface UnSupportSchema extends Omit<Schema, "type"> {
  type: JSONSchemaTypeName[];
}

export interface OneOfSchema extends Omit<Schema, "oneOf"> {
  oneOf: Schema[];
}

export interface AllOfSchema extends Omit<Schema, "allOf"> {
  allOf: Schema[];
}

export interface AnyOfSchema extends Omit<Schema, "anyOf"> {
  anyOf: Schema[];
}

export interface MultiTypeSchema extends Omit<Schema, "type"> {
  type: JSONSchemaTypeName[];
}

export interface ObjectSchema extends Omit<Schema, "type"> {
  type: "object";
}

export interface FunctionSchema extends Omit<ObjectSchema, "format"> {
  format: "function";
}

export interface ObjectSchemaWithAdditionalProperties extends ObjectSchema {
  additionalProperties: JSONSchemaDefinition;
}

export interface ArraySchema extends Omit<Schema, "type"> {
  type: "array";
}

export interface PrimitiveSchema extends Omit<Schema, "type"> {
  type: "string" | "number" | "integer" | "boolean" | "null";
}

export interface AnySchema extends Omit<Schema, "type"> {
  type: "any";
}
