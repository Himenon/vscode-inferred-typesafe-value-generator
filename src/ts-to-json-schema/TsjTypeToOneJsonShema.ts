import * as tsj from "ts-json-schema-generator";
import { TemplateLiteralType } from "./Type/TemplateLiteralType";
import { FunctionType } from "./Type/FunctionType";
import type { JSONSchema7Type, JSONSchema7TypeName } from "json-schema";

export class TsjTypeToOneJsonShema {
  private visitedMap: { [id: string]: number } = {};
  private typeName(value: JSONSchema7Type): JSONSchema7TypeName {
    if (value === null) {
      return "null";
    }

    const type = typeof value;
    if (type === "string" || type === "number" || type === "boolean") {
      return type;
    }

    if (Array.isArray(value)) {
      return "array";
    } else if (type === "object") {
      return "object";
    } else {
      throw new Error(`JavaScript type "${type}" can't be converted to JSON type name`);
    }
  }

  private convert(type: tsj.BaseType): tsj.Schema {
    if (type instanceof tsj.ObjectType) {
      return this.converObjectType(type);
    }
    if (type instanceof tsj.StringType) {
      return this.convertStringType(type);
    }
    if (type instanceof tsj.NumberType) {
      return this.convertNumberType(type);
    }
    if (type instanceof tsj.UnionType) {
      return this.convertUnionType(type);
    }
    if (type instanceof tsj.IntersectionType) {
      return this.convertIntersectionType(type);
    }
    if (type instanceof tsj.BooleanType) {
      return this.convertBooleanType(type);
    }
    if (type instanceof tsj.AliasType) {
      return this.convertAlias(type);
    }
    if (type instanceof tsj.DefinitionType) {
      return this.convertDefinitionType(type);
    }
    if (type instanceof tsj.LiteralType) {
      return this.convertLiteralType(type);
    }
    if (type instanceof tsj.ArrayType) {
      return this.convertArrayType(type);
    }
    if (type instanceof tsj.EnumType) {
      return this.convertEnumType(type);
    }
    if (type instanceof tsj.ReferenceType) {
      return this.convertReferenceType(type);
    }
    if (type instanceof tsj.AnnotatedType) {
      return this.convertAnnotatedType(type);
    }
    if (type instanceof tsj.AnyType) {
      return this.convertAnyType(type);
    }
    if (type instanceof TemplateLiteralType) {
      return this.convertTemplateLiteralType(type);
    }
    if (type instanceof FunctionType) {
      return this.convertFunctionType(type);
    }
    if (type.getName() === "symbol") {
      return this.convertsymbolType();
    }
    throw new Error(`Unsupport type ${type.getName()}. If you want a fix, please submit a pull request for the code to be reproduced.`);
  }

  private convertFunctionType(type: FunctionType): tsj.Schema {
    return {
      type: "object",
      properties: {},
    };
  }

  private convertTemplateLiteralType(type: TemplateLiteralType): tsj.Schema {
    return {
      type: "string",
    };
  }

  private convertsymbolType(): tsj.Schema {
    return {
      type: "object",
      format: "symbol",
    };
  }

  private convertAnyType(type: tsj.AnyType): tsj.Schema {
    return {
      type: "object",
      properties: {},
    };
  }

  /** TODO annotationのdescriptionをchildにわたすといいかもしれない */
  private convertAnnotatedType(type: tsj.AnnotatedType): tsj.Schema {
    return this.convert(type.getType());
  }

  private convertEnumType(type: tsj.EnumType): tsj.Schema {
    const values = tsj.uniqueArray(type.getValues());
    const types = tsj.uniqueArray(values.map(this.typeName));

    return values.length === 1 ? { type: types[0], const: values[0] } : { type: types.length === 1 ? types[0] : types, enum: values };
  }

  private convertArrayType(type: tsj.ArrayType): tsj.Schema {
    return {
      type: "array",
      items: [this.convert(type.getItem())],
    };
  }

  private convertLiteralType(type: tsj.LiteralType): tsj.Schema {
    return {
      type: this.typeName(type.getValue()),
      const: type.getValue(),
    };
  }

  private convertDefinitionType(type: tsj.DefinitionType): tsj.Schema {
    return this.convert(type.getType());
  }

  /**
   * DO NOT CONVERT REFERENCE TYPE
   */
  private convertAlias(type: tsj.AliasType): tsj.Schema {
    const id = type.getId();
    if (this.visitedMap[id] !== undefined && this.visitedMap[id] > 2) {
      return {
        type: "object",
      };
    }
    this.visitedMap[id] = (this.visitedMap[id] || 0) + 1;
    return this.convert(type.getType());
  }

  private convertReferenceType(type: tsj.ReferenceType): tsj.Schema {
    const id = type.getId();
    if (this.visitedMap[id] !== undefined && this.visitedMap[id] > 2) {
      return {
        type: "object",
      };
    }
    this.visitedMap[id] = (this.visitedMap[id] || 0) + 1;
    return this.convert(type.getType());
  }

  private convertIntersectionType(type: tsj.IntersectionType): tsj.Schema {
    return {
      allOf: type.getTypes().map((t) => this.convert(t)),
    };
  }

  private convertUnionType(type: tsj.UnionType): tsj.Schema {
    return {
      anyOf: type.getTypes().map((t) => this.convert(t)),
    };
  }

  private converObjectType(type: tsj.ObjectType): tsj.Schema {
    const schema: tsj.Schema = {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false,
    };
    const properties = type.getProperties();
    properties.forEach((property) => {
      const name = property.getName();
      const type = property.getType();
      if (type) {
        schema.properties![name] = this.convert(type);
      }
      if (property.isRequired()) {
        schema.required!.push(name);
      }
    });
    return schema;
  }

  private convertBooleanType(type: tsj.StringType): tsj.Schema {
    return {
      type: "boolean",
    };
  }

  private convertStringType(type: tsj.StringType): tsj.Schema {
    return {
      type: "string",
    };
  }

  private convertNumberType(type: tsj.NumberType): tsj.Schema {
    return {
      type: "number",
    };
  }

  public getSchema(type: tsj.BaseType): tsj.Schema {
    this.visitedMap = {};
    return this.convert(type);
  }
}
