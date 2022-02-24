import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

describe("Array Expression", () => {
  test("Create Empty List", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = [""]`,
      originalValue: `const value = ["text"];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = ["text"];`));
  });

  test("Leave existing items", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = [""]`,
      originalValue: `const value = ["a", "b", "c"];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = ["a", "b", "c"];`));
  });

  test("Update Invalid Type Items", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = [""]`,
      originalValue: `const value = [1, "b", 3, false];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = ["", "b", "", ""];`));
  });

  test("Union Type", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = ["", 0, false]`,
      originalValue: `const value = [1, "b", 3, true, "A"];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = [1, "b", 3, true, "A"];`));
  });

  test("Object List", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = [{ a: 1 }]`,
      originalValue: `const value = [{ a: 100, b: 2}];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = [{ a: 100 }];`));
  });

  test("Spread Operator", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = [""]`,
      originalValue: `const value = [...items, "ABC", ...items2, 1234, ...items3];`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = [...items, "ABC", ...items2, "", ...items3];`));
  });
});
