import * as ts from "typescript";
import { createSourceFile } from "../ts-ast-utils/create-source-file";
import { getValueExpression } from "../extract-type-node";

export type Expression =
  | ts.ObjectLiteralExpression
  | ts.StringLiteral
  | ts.NumericLiteral
  | ts.Identifier
  | ts.ArrayLiteralExpression
  | ts.ArrowFunction
  | ts.FunctionExpression
  | ts.ClassExpression;

export type CreateTransformerFactory<T extends Expression> = (base: T) => ts.TransformerFactory<T>;

export interface VariableExpressionMergeArgs<T extends Expression> {
  /**
   * merge source
   *
   * const value = {
   *   ...
   * };
   */
  correctTypeValue: string | T;
  /**
   * mergeavlue source
   *
   * const value = {
   *   ...
   * };
   */
  originalValue?: string | T;

  createTransformers: CreateTransformerFactory<T>[];
}

const extractValueExpression = (code: string) => {
  const sourceFile = createSourceFile("var.ts", code);
  const variableStatement = sourceFile.statements[0] as ts.VariableStatement;
  const valueExpression = getValueExpression(variableStatement);
  return valueExpression;
};

const getVariableExpression = <T extends Expression>(expressionLike: string | T): T => {
  if (typeof expressionLike === "string") {
    const valueExpression = extractValueExpression(expressionLike);
    if (!valueExpression) {
      throw new Error("why?");
    }
    return valueExpression as T;
  }
  return expressionLike;
};

export const variableExpressionTransformer = <T extends Expression>(args: VariableExpressionMergeArgs<T>): Expression => {
  const correctTypeNode = getVariableExpression(args.correctTypeValue);
  const originalValueNode = getVariableExpression(args.originalValue || args.correctTypeValue);
  const transformers = args.createTransformers.map((createTransformer) => createTransformer(originalValueNode));
  const result = ts.transform<T>(correctTypeNode, transformers);
  result.dispose();
  return result.transformed[0];
};
