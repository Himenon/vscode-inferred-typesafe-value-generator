import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import * as SampleData from "./SampleData";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

describe("Call Expression", () => {
  test("CallExpression / Arrow Function", () => {
    const originalValue = `const value = (() => undefined)();`;
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
  test("CallExpression / Noname Function Expression", () => {
    const originalValue = [`const value = (function () {})();`].join("\n");
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

  test("CallExpression / Noname Function Expression", () => {
    const originalValue = [`const value = (function () {})();`].join("\n");
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

  test("CallExpression / Immediately Invoked Function Expression", () => {
    const originalValue = [`const value = (function myfunction() {})();`].join("\n");
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

  test("CallExpression / Call by function name", () => {
    const originalValue = [`const value = myfunction();`].join("\n");
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
