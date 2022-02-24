import * as ts from "typescript";
import * as Logger from "../logger";

export const searchVariableStatement = (node: ts.Node): ts.VariableStatement | undefined => {
  if (!node.parent) {
    return;
  }
  if (ts.isVariableStatement(node.parent)) {
    return node.parent;
  }
  if (ts.isSourceFile(node.parent)) {
    return undefined;
  }
  return searchVariableStatement(node.parent);
};

export const getVariableTypeNode = (node: ts.VariableStatement) => {
  const variableDeclaration = node.declarationList.declarations.find((variableDeclaration) => {
    return !!variableDeclaration.type;
  });
  return variableDeclaration?.type;
};

export const getVariableName = (node: ts.VariableStatement) => {
  const variableDeclaration = node.declarationList.declarations.find((variableDeclaration) => {
    return !!variableDeclaration.initializer;
  });
  return variableDeclaration?.name;
};

export const getValueExpression = (node: ts.VariableStatement) => {
  const variableDeclaration = node.declarationList.declarations.find((variableDeclaration) => {
    return !!variableDeclaration.initializer;
  });
  const initializer = variableDeclaration?.initializer;
  if (initializer && ts.isAsExpression(initializer)) {
    return initializer.expression;
  }
  return initializer;
};

export interface GetVaraibleStatement {
  /**
   * 変数定義全体
   */
  variableStatement?: ts.VariableStatement;
  /**
   * 変数の型定義
   */
  valueTypeNode?: ts.TypeNode;
  /**
   * 変数の値
   */
  valueExpression?: ts.Expression;
  /**
   * 変数名
   */
  variableName?: ts.BindingName;
}

export const getVaraibleStatement = (node: ts.Node): GetVaraibleStatement => {
  try {
    const variableStatement = searchVariableStatement(node);
    if (!variableStatement) {
      return {};
    }
    const valueTypeNode = getVariableTypeNode(variableStatement);
    const valueExpression = getValueExpression(variableStatement);
    const variableName = getVariableName(variableStatement);
    if (valueTypeNode && variableName && ts.isTypeNode(valueTypeNode)) {
      return { variableStatement, valueTypeNode, valueExpression, variableName };
    }
  } catch (error) {
    const e = error as Error;
    Logger.error(e.stack);
  }
  return {};
};
