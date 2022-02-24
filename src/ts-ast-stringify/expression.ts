import * as ts from "typescript";
import * as vm from "vm";
import * as Logger from "../logger";

export const convertExpressionToValue = (expression: ts.Expression): any => {
  try {
    const code = `extractValue = ${expression.getText()};`;
    const context = {
      extractValue: undefined,
    };
    const vmContext = vm.createContext(context);
    const script = new vm.Script(code);
    script.runInContext(vmContext);
    return context.extractValue;
  } catch (error) {
    Logger.error((error as Error).message);
    return undefined;
  }
};
