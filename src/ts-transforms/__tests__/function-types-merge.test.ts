import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import * as SampleData from "./SampleData";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

describe("Function Value", () => {
  test("Arrow Function", () => {
    const originalValue = `const value = () => undefined;`;
    SampleData.correctTypeValues.forEach((item) => {
      const correctTypeValue = `const value = ${item};`;
      const expression = variableExpressionTransformer({
        correctTypeValue: correctTypeValue,
        originalValue: originalValue,
        createTransformers,
      });
      const code = codeFormat(stringifyVariableExpression(expression));
      expect(code).toBe(codeFormat(correctTypeValue));
    });
  });
  test("Function Expression", () => {
    const originalValue = [`const value = function () {`, `  return undefined;`, `};`].join("\n");
    SampleData.correctTypeValues.forEach((item) => {
      const correctTypeValue = `const value = ${item};`;
      const expression = variableExpressionTransformer({
        correctTypeValue: correctTypeValue,
        originalValue: originalValue,
        createTransformers,
      });
      const code = codeFormat(stringifyVariableExpression(expression));
      expect(code).toBe(codeFormat(correctTypeValue));
    });
  });
});
