import * as ts from "typescript";
import * as Module from "../index";
import * as path from "path";
import * as fs from "fs";
import { createSourceFile } from "../../ts-ast-utils/create-source-file";

const code = fs.readFileSync(path.join(__dirname, "./sample-code.ts"), "utf-8");
const sourceFile = createSourceFile("_", code);

const { statements } = sourceFile;

describe("抽出テスト", () => {
  test("statements[1]", () => {
    const variableStatement = statements[1] as ts.VariableStatement;
    expect(ts.isVariableStatement(variableStatement)).toBeTruthy();
    const type = Module.getVariableTypeNode(variableStatement) as ts.TypeNode;
    expect(ts.isTypeNode(type)).toBeTruthy();
    expect(type.getFullText().trim()).toBe("Sample1");
  });

  test("statements[2]", () => {
    const variableStatement = statements[2] as ts.VariableStatement;
    expect(ts.isVariableStatement(variableStatement)).toBeTruthy();
    const type = Module.getVariableTypeNode(variableStatement) as ts.TypeNode;
    expect(ts.isTypeNode(type)).toBeTruthy();
    expect(type.getFullText().trim()).toBe("Types.Sample2");
  });
});
