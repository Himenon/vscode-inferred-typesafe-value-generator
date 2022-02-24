import * as ts from "typescript";

export const generateTsNode = (value: any): ts.Expression | undefined => {
  const dummyCode = `const value = ${JSON.stringify(value, null, 2)}`;
  const source = ts.createSourceFile("", dummyCode, ts.ScriptTarget.ESNext);
  const variableStatement = source.statements[0];
  if (!ts.isVariableStatement(variableStatement)) {
    return undefined;
  }
  const declaration = variableStatement.declarationList.declarations[0];
  if (!ts.isVariableDeclaration(declaration)) {
    return undefined;
  }
  return declaration.initializer;
};
