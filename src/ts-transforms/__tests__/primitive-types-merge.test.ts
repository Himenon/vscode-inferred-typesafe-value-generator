import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import * as SampleData from "./SampleData";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

describe("Primtiive Value", () => {
  test("StringLiteral", () => {
    const originalValue = `const value = "REAL VALUE";`;
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = "DUMMY";`,
      originalValue: originalValue,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(originalValue));
  });
  test("NumericLiteral", () => {
    const originalValue = `const value = 1234;`;
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = 0;`,
      originalValue: originalValue,
      createTransformers,
    });
    const code = stringifyVariableExpression(expression);
    expect(codeFormat(code)).toBe(codeFormat(originalValue));
  });
  test("Boolean/true", () => {
    const originalValue = `const value = true;`;
    const correctTypeValue = `const value = false;`;
    const expression = variableExpressionTransformer({
      correctTypeValue: correctTypeValue,
      originalValue: originalValue,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(originalValue));
  });
  test("Boolean/false", () => {
    const originalValue = `const value = false;`;
    const correctTypeValue = `const value = true;`;
    const expression = variableExpressionTransformer({
      correctTypeValue: correctTypeValue,
      originalValue: originalValue,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(originalValue));
  });
  test("Identifer", () => {
    const originalValue = `const value = previousValue;`;
    SampleData.correctTypeValues.forEach((item) => {
      const correctTypeValue = `const value = ${item};`;
      const expression = variableExpressionTransformer({
        correctTypeValue: correctTypeValue,
        originalValue: originalValue,
        createTransformers,
      });
      const code = codeFormat(stringifyVariableExpression(expression));
      expect(code).toBe(codeFormat(originalValue));
    });
  });
});
