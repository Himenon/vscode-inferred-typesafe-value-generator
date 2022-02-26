import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";
import * as SampleData from "./SampleData";

const createTransformers = [Module.merge];
describe("Binary Expression", () => {
  test("Original Value will Win!", () => {
    const originalValue = `const value = a + b!;\n`;
    SampleData.correctTypeValues.forEach((item) => {
      const expression = variableExpressionTransformer({
        correctTypeValue: `const value = ${item};`,
        originalValue: originalValue,
        createTransformers,
      });
      const code = codeFormat(stringifyVariableExpression(expression));
      expect(code).toBe(codeFormat(originalValue));
    });
  });
});
