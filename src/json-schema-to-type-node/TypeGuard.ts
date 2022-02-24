import type * as SchemaType from "./Types";

export const isReference = (data: any): data is SchemaType.Reference => {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  return typeof data.$ref === "string";
};

export const isUnSupportSchema = (schema: SchemaType.Schema): schema is SchemaType.UnSupportSchema => {
  return Array.isArray(schema.type);
};

export const isObjectSchema = (schema: SchemaType.Schema): schema is SchemaType.ObjectSchema => {
  return schema.type === "object";
};

/**
 * 独自定義
 */
export const isFunctionSchema = (schema: SchemaType.Schema): schema is SchemaType.FunctionSchema => {
  return isObjectSchema(schema) && schema.format === "function";
};

export const isHasNoMembersObject = (schema: SchemaType.Schema): boolean => {
  return Object.keys(schema).length === 0;
};

export const isArraySchema = (schema: SchemaType.Schema): schema is SchemaType.ArraySchema => {
  return schema.type === "array";
};

export const isPrimitiveSchema = (schema: SchemaType.Schema): schema is SchemaType.PrimitiveSchema => {
  if (typeof schema.type !== "string") {
    return false;
  }
  if (schema.type === "object") {
    return false;
  }
  if (schema.type === "array") {
    return false;
  }
  return true;
};

export const isNumberArray = (list: any[]): list is number[] => {
  return !list.some((item) => typeof item !== "number");
};

export const isStringArray = (list: any[]): list is string[] => {
  return !list.some((item) => typeof item !== "string");
};

export const isObjectSchemaWithAdditionalProperties = (
  schema: SchemaType.ObjectSchema
): schema is SchemaType.ObjectSchemaWithAdditionalProperties => {
  return !!schema.additionalProperties;
};

export const isOneOfSchema = (schema: SchemaType.Schema): schema is SchemaType.OneOfSchema => {
  return !!schema.oneOf && typeof schema.oneOf !== "boolean" && Array.isArray(schema.oneOf);
};

export const isAllOfSchema = (schema: SchemaType.Schema): schema is SchemaType.AllOfSchema => {
  return !!schema.allOf && typeof schema.allOf !== "boolean" && Array.isArray(schema.allOf);
};

export const isAnyOfSchema = (schema: SchemaType.Schema): schema is SchemaType.AnyOfSchema => {
  return !!schema.anyOf && typeof schema.anyOf !== "boolean" && Array.isArray(schema.anyOf);
};

export const isMultiTypeSchema = (schema: SchemaType.Schema): schema is SchemaType.MultiTypeSchema => {
  return Array.isArray(schema.type);
};
