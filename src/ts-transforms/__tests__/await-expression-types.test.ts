import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import * as SampleData from "./SampleData";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

describe("Awaipt Expression", () => {
  test("Await Expression", () => {
    const originalValue = [`const value = await new Promise((resolve) => resolve(undefined));`].join("\n");
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
