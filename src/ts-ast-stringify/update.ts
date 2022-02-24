import * as ts from "typescript";

export const updateVariableStatement = (variableStatement: ts.VariableStatement, newInitializer?: ts.Expression) => {
  const declarations = variableStatement.declarationList.declarations.map((declaration) => {
    if (ts.isVariableDeclaration(declaration)) {
      return ts.factory.updateVariableDeclaration(
        declaration,
        declaration.name,
        declaration.exclamationToken,
        declaration.type,
        newInitializer || declaration.initializer
      );
    }

    return declaration;
  });
  const declarationList = ts.factory.createVariableDeclarationList(declarations, variableStatement.declarationList.flags);

  const newVariableStatement = ts.factory.createVariableStatement(variableStatement.modifiers, declarationList);
  return newVariableStatement;
};
