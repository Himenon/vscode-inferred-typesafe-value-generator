import * as ts from "typescript";

export const convertAstToTypeScriptCode = (sourceFile: ts.SourceFile): string => {
  const printer = ts.createPrinter(); // AST -> TypeScriptに変換
  return printer.printFile(sourceFile);
};

export const stringify = (statement: ts.Statement): string => {
  const source = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, true);
  const newSource = ts.factory.updateSourceFile(source, [statement]);
  return convertAstToTypeScriptCode(newSource);
};

export const stringifyVariableExpression = (expression: ts.Expression) => {
  const factory = ts.factory;
  const statement = factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [factory.createVariableDeclaration(factory.createIdentifier("value"), undefined, undefined, expression)],
      ts.NodeFlags.Const
    )
  );
  return stringify(statement);
};
