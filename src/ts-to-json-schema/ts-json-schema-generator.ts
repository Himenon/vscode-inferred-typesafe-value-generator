import * as ts from "typescript";
import * as tsj from "ts-json-schema-generator";
import * as path from "path";
import * as glob from "glob";
import { DateParser } from "./NodeParser/DateParser";
import { FunctionNodeParser } from "./NodeParser/FunctionNodeParser";
import { FunctionTypeFormatter } from "./TypeFormatter";
import type { GetTypeName } from "../ts-ast-utils/get-type-name";
import type { JSONSchema7 as Schema, JSONSchema7TypeName as JSONSchemaTypeName } from "json-schema";

export interface GenerateJsonSchemaArgs {
  files: string[];
  typeName: GetTypeName;
  basePath?: string;
}

/**
 * 動的なtsconfigの読み取りに対応させる
 */
const createProgram = (config: tsj.Config): ts.Program => {
  const rootNamesFromPath = config.path ? glob.sync(path.resolve(config.path)) : [];
  const rootNames = rootNamesFromPath;
  const program: ts.Program = ts.createProgram(rootNames, {
    noEmit: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
    strictNullChecks: false,
  });
  return program;
};

export const generate = (args: GenerateJsonSchemaArgs): Schema => {
  const config: tsj.Config = {
    path: args.files[0],
    skipTypeCheck: true,
    type: args.typeName.firstTypeName,
  };
  const formatter = tsj.createFormatter(config, (fmt, circularReferenceTypeFormatter) => {
    fmt.addTypeFormatter(new FunctionTypeFormatter(circularReferenceTypeFormatter));
  });
  const program = createProgram(config);
  const parser = tsj.createParser(program, config, (prs) => {
    prs.addNodeParser(new FunctionNodeParser());
    prs.addNodeParser(new DateParser());
  });
  const generator = new tsj.SchemaGenerator(program, parser, formatter, config);

  if (args.typeName.isPrimtive) {
    return {
      type: args.typeName.firstTypeName as JSONSchemaTypeName,
    };
  }

  if (args.typeName.isIntersectionType) {
    const schemas = args.typeName.intersectinoTypeNames.map((target) => generator.createSchema(target.firstTypeName));
    return schemas.reduce<Schema>((previous, current) => {
      const allOf = previous.allOf || [];
      if (current.$ref) {
        allOf.push({ $ref: current.$ref });
      }
      return {
        allOf: allOf,
        definitions: { ...previous.definitions, ...current.definitions },
      };
    }, {});
  }

  if (args.typeName.isArray) {
    const schema = generator.createSchema(args.typeName.firstTypeName);
    return {
      type: "array",
      items: {
        $ref: schema.$ref,
      },
      definitions: schema.definitions,
    };
  }

  return generator.createSchema(args.typeName.firstTypeName);
};
