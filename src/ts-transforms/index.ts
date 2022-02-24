import { merge as mergeTransformer } from "./expression-merge";
import { variableExpressionTransformer } from "./expression-transformer";

const createTransformers = [mergeTransformer];

export interface MergeArgs {
  /**
   * @example JSON.stringify({ a: 1 })
   * @example JSON.stringify(1)
   * @example JSON.stringify("text")
   */
  correctTypeValue: string;
  originalValue: string | undefined;
}

export const merge = (args: MergeArgs) => {
  const expression = variableExpressionTransformer({
    correctTypeValue: `const value = ${args.correctTypeValue}`,
    originalValue: args.originalValue && `const value = ${args.originalValue}`,
    createTransformers,
  });
  return expression;
};
