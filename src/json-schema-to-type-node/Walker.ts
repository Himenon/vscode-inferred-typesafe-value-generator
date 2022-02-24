import * as TypeGuard from "./TypeGuard";
import type * as Types from "./Types";
import * as DotProp from "dot-prop";
import * as Logger from "../logger";

export interface ConvertedObject {
  value: any;
  errorMessages: string[];
}

export class Walker {
  private readonly schema: Types.Schema;
  constructor(schema: Types.Schema) {
    this.schema = JSON.parse(JSON.stringify(schema));
  }

  private _convert = (schema?: Types.Schema): any => {
    if (!schema) {
      return "undefined";
    }
    if (TypeGuard.isReference(schema)) {
      return this.reference(schema);
    }
    if (TypeGuard.isObjectSchema(schema)) {
      if (TypeGuard.isFunctionSchema(schema)) {
        return this.functionTypeValue(schema);
      }
      return this.convertObject(schema);
    }
    if (TypeGuard.isPrimitiveSchema(schema)) {
      return this.primitive(schema);
    }
    if (TypeGuard.isArraySchema(schema)) {
      return this.array(schema);
    }
    if (TypeGuard.isMultiTypeSchema(schema)) {
      return this.multiTypeValue(schema);
    }
    if (TypeGuard.isAnyOfSchema(schema)) {
      return this.anyOfValue(schema);
    }
    if (TypeGuard.isOneOfSchema(schema)) {
      return this.oneOfValue(schema);
    }
    if (TypeGuard.isAllOfSchema(schema)) {
      return this.allOfValue(schema);
    }
    throw new Error(`UnSupport JSON Schema: ${JSON.stringify(schema)}`);
  };

  public convert = (schema?: Types.Schema): ConvertedObject => {
    try {
      const value = this._convert(schema);
      return {
        value,
        errorMessages: [],
      };
    } catch (error) {
      const e = error as Error;
      Logger.error(e.stack);
      return {
        value: undefined,
        errorMessages: [e.message],
      };
    }
  };

  private undefinedValue = (): any => {
    return undefined;
  };

  private reference = (schema: Types.Reference): any => {
    const decodeRef = decodeURIComponent(schema.$ref);
    const ref = decodeRef.replace(/\./g, "\\.").replace(/^#\//, "").replace(/\//g, ".");
    const refSchema = DotProp.get(this.schema, ref) as any;
    return this._convert(refSchema);
  };

  private array = (schema: Types.ArraySchema): any[] => {
    const items = schema.items;
    if (!items || items === true) {
      return [];
    }
    if (!Array.isArray(items)) {
      return [this._convert(items)];
    }
    return items.map((item) => {
      if (typeof item === "boolean") {
        return "";
      }
      return this._convert(item);
    });
  };

  private allOfValue = (schema: Types.AllOfSchema) => {
    if (schema.allOf.length > 0) {
      const allOfObject = schema.allOf.reduce((previous, current) => {
        const nextSchema = this._convert(current);
        return { ...previous, ...nextSchema };
      }, {});
      return allOfObject;
    }
    return this.undefinedValue();
  };

  private oneOfValue = (schema: Types.OneOfSchema) => {
    if (schema.oneOf.length > 0) {
      return this._convert(schema.oneOf[0]);
    }
    return this.undefinedValue();
  };

  private anyOfValue = (schema: Types.AnyOfSchema) => {
    if (schema.anyOf.length > 0) {
      return this._convert(schema.anyOf[0]);
    }
    return this.undefinedValue();
  };

  private multiTypeValue = (schema: Types.MultiTypeSchema) => {
    const types = schema.type;
    if (types.length > 0) {
      return this._convert({ type: types[0] });
    }
    return this.undefinedValue();
  };

  private stringValue = (schema: Types.PrimitiveSchema): string => {
    let estimateValue: any;
    if (schema.const) {
      estimateValue = schema.const;
    } else if (schema.default) {
      estimateValue = schema.default;
    } else if (schema.enum && schema.enum.length > 0) {
      estimateValue = schema.enum[0];
    }
    if (typeof estimateValue === "string") {
      return estimateValue;
    }
    return "";
  };

  private numberValue = (schema: Types.PrimitiveSchema): number => {
    let estimateValue: any;
    if (schema.const) {
      estimateValue = schema.const;
    } else if (schema.default) {
      estimateValue = schema.default;
    } else if (schema.enum && schema.enum.length > 0) {
      estimateValue = schema.enum[0];
    }
    if (estimateValue) {
      if (typeof estimateValue === "string") {
        const value = parseInt(estimateValue, 10);
        return value || 0;
      } else if (typeof estimateValue === "number") {
        return estimateValue;
      }
    }
    return 0;
  };

  private booleanValue = (schema: Types.PrimitiveSchema): boolean => {
    let estimateValue: any;
    if (schema.default) {
      estimateValue = schema.default;
    } else if (schema.enum && schema.enum.length > 0) {
      estimateValue = schema.enum[0];
    }
    if (typeof estimateValue === "boolean") {
      return estimateValue;
    }
    if (typeof estimateValue === "string") {
      return Boolean(estimateValue);
    }
    return false;
  };

  private primitive = (schema: Types.PrimitiveSchema) => {
    switch (schema.type) {
      case "boolean":
        return this.booleanValue(schema);
      case "integer":
      case "number":
        return this.numberValue(schema);
      case "string":
        return this.stringValue(schema);
      default:
        throw new Error("UNSupport Type!");
    }
  };

  private convertObject = (schema: Types.ObjectSchema) => {
    const properties = schema.properties || {};
    const obj: Record<string, any> = {};
    Object.entries(properties).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        return;
      }
      obj[key] = this._convert(value);
    });
    return obj;
  };

  /**
   * TODO
   */
  private functionTypeValue = (_schema: Types.FunctionSchema) => {
    return undefined;
  };
}
