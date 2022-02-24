import * as path from "path";
import * as SearchTypeNode from "./search-type-node";
import * as ExtractTypeNode from "./extract-type-node";
import * as TsAstStringify from "./ts-ast-stringify";
import * as TsToJsonSchema from "./ts-to-json-schema";
import * as TsTransforms from "./ts-transforms";
import { Walker } from "./json-schema-to-type-node";
import { getTypeName } from "./ts-ast-utils/get-type-name";
import * as Logger from "./logger";

export interface CompletionArgs {
  filename: string;
  code: string;
  lineNumber: number;
  columNumber: number;
}

export interface UpdateCompletion {
  position: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  value: string;
  variableName: string;
}

export interface Completion {
  errorMessages: string[];
  update?: UpdateCompletion;
}

export const completion = ({ filename, code, lineNumber, columNumber }: CompletionArgs): Completion => {
  const { bestMatchNode, getNodeArea } = SearchTypeNode.create({
    filename,
    code,
    lineNumber,
    columNumber,
  });
  Logger.log("RUN: getVaraibleStatement");
  const {
    variableStatement,
    valueTypeNode,
    valueExpression: originalValue,
    variableName,
  } = ExtractTypeNode.getVaraibleStatement(bestMatchNode);

  const errorMessages: string[] = [];
  if (!valueTypeNode || !variableStatement || !variableName) {
    errorMessages.push("Not found Variable Statement");
    return {
      errorMessages: errorMessages,
    };
  }

  Logger.log("RUN: getNodeArea");
  const variableStatementArea = getNodeArea(variableStatement);
  if (!variableStatementArea) {
    errorMessages.push(`Cannot detect variable statement position.`);
    return {
      errorMessages: errorMessages,
    };
  }

  Logger.log("RUN: TsToJsonSchema.generateJsonSchema");
  const { jsonSchema, errorMessage } = TsToJsonSchema.generateJsonSchema({
    files: [filename],
    typeName: getTypeName(valueTypeNode),
    basePath: path.dirname(filename),
  });

  if (errorMessage) {
    errorMessages.push(errorMessage);
  }

  if (!jsonSchema) {
    return {
      errorMessages: errorMessages,
    };
  }

  Logger.log("RUN: Walker Convert");
  const walker = new Walker(jsonSchema);
  const { value: correctTypeValue, errorMessages: convertErrorMessages } = walker.convert(jsonSchema);
  if (convertErrorMessages.length) {
    return {
      errorMessages: errorMessages.concat(convertErrorMessages),
    };
  }

  const mergedExpression = TsTransforms.merge({
    correctTypeValue: JSON.stringify(correctTypeValue),
    originalValue: originalValue?.getText(),
  });

  const update: UpdateCompletion = {
    position: variableStatementArea,
    value: TsAstStringify.create(variableStatement, mergedExpression),
    variableName: variableName.getText(),
  };

  return {
    errorMessages,
    update,
  };
};
