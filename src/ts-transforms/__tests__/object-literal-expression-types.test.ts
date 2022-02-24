import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";
import * as SampleData from "./SampleData";

const createTransformers = [Module.merge];

describe("Object Value", () => {
  test("Original Value is Object", () => {
    const originalValue = `const value = {};`;
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

  test("Original Value is Primitive / Collect type is Object", () => {
    const correctTypeValue = `const value = {};`;
    SampleData.correctTypeValues.forEach((item) => {
      const originalValue = `const value = ${item};`;
      const expression = variableExpressionTransformer({
        correctTypeValue: correctTypeValue,
        originalValue: originalValue,
        createTransformers,
      });
      const code = codeFormat(stringifyVariableExpression(expression));
      expect(code).toBe(codeFormat(correctTypeValue));
    });
  });

  test("Merge Primitive Value", () => {
    const originalValue = `const value = {
  number_value: 123456789,
  string_value: "hello world",
  boolean_value: true,
}`;
    const correctTypeValue = `const value = {
  number_value: 1,
  string_value: "text",
  boolean_value: false,
  ignore_number_value: 0,
  ignore_string_value: "",
  ignore_boolean_value: true,
}`;
    const expectValue = `const value = {
  number_value: 123456789,
  string_value: "hello world",
  boolean_value: true,
  ignore_number_value: 0,
  ignore_string_value: "",
  ignore_boolean_value: true,
}`;
    const expression = variableExpressionTransformer({
      correctTypeValue: correctTypeValue,
      originalValue: originalValue,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(expectValue));
  });

  test("merge identifier", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { "a": 0, b: 1, var: myvar };`,
      originalValue: `const value = { a: myvalue, b: 100, var: "aa" };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { a: myvalue, b: 100, var: myvar };`));
  });

  test("merge identifer", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { service: { name: "aa" }, key: value };`,
      originalValue: `const value = { service: service };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { service: service, key: value };`));
  });

  test("merge class expression", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { service: { name: "aa" }, key: value };`,
      originalValue: `const value = { service: new Service() };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { service: new Service(), key: value };`));
  });

  test("Shorthund", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { service: { name: "aa" } };`,
      originalValue: `const value = { service };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { service };`));
  });

  test("SpreadOperator", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { service: { name: "text" } };`,
      originalValue: `const value = { service: { ...service }, ...values1, ...values2 };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { service: { ...service }, ...values1, ...values2 };`));
  });

  test("SpreadOperator2", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { service: { name: "" }, name: "" };`,
      originalValue: `const value = { service: { ...service, name: 1 }, ...values1, ...values2 };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { service: { ...service, name: "" }, ...values1, ...values2 };`));
  });

  test.skip("SpreadOperator Partial Update", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: `const value = { value1: "", value2: 0 };`,
      originalValue: `const value = { ...{ value1: 1234 }, ...{ value2: "TEXT" } };`,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(codeFormat(`const value = { ...{ value1: "" }, ...{ value2: 0 } };`));
  });
});
