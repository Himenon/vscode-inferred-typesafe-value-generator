import { variableExpressionTransformer } from "../expression-transformer";
import * as Module from "../expression-merge";
import { codeFormat } from "../../code-format";
import { stringifyVariableExpression } from "../../ts-ast-stringify/stringify";

const createTransformers = [Module.merge];

const originalValue = `const value = {
  number_value: 1,
  string_value: "two",
  boolean_value: false,
  object_value: {
    e: 1,
  },
  noname_function: () => undefined,
  named_function: myfunction(),
  call_noname_function: (() => undefined)(),
  call_named_function: (function myfunction() {})(),
  variable_value: myvalue,
  array_value: [],
  class_value: new (class Klass {})(),
};
`;

describe("Unchanged test", () => {
  test("Noop", () => {
    const expression = variableExpressionTransformer({
      correctTypeValue: originalValue,
      createTransformers,
    });
    const code = codeFormat(stringifyVariableExpression(expression));
    expect(code).toBe(originalValue);
  });
});
