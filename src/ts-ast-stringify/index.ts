import * as ts from "typescript";
import { stringify } from "./stringify";
import { updateVariableStatement } from "./update";
import * as Formatter from "../code-format";
import { convertExpressionToValue } from "./expression";
export { convertExpressionToValue };

export const create = (inputVariableStatement: ts.VariableStatement, expression: ts.Expression) => {
  const variableStatement = updateVariableStatement(inputVariableStatement, expression);
  const source = stringify(variableStatement);
  const code = Formatter.codeFormat(source);
  return code;
};
