import * as ts from "typescript";
import * as Module from "../index";
import * as path from "path";
import * as fs from "fs";
import { createSourceFile } from "../../ts-ast-utils/create-source-file";

const code = fs.readFileSync(path.join(__dirname, "./sample-code.ts"), "utf-8");
const sourceFile = createSourceFile("_", code);

const { statements } = sourceFile;

describe("searchVariableStatement", () => {
  test("statements[1]", () => {
    const variableStatement = statements[1] as ts.VariableStatement;
    expect(ts.isVariableStatement(variableStatement)).toBeTruthy();
    variableStatement.forEachChild((childNode) => {
      const resultStatement = Module.searchVariableStatement(childNode);
      expect(resultStatement?.getFullText()).toBe(variableStatement.getFullText());
    });
  });
});
