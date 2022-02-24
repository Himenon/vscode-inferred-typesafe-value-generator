import * as ts from "typescript";

export const SyntaxKinds = [ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword];

/**
 * nodeが変数
 *
 * @param node
 * @returns
 */
export const isIdentifier = (node: ts.Node): boolean => {
  return ts.isIdentifier(node);
};

/**
 * nodeが観ずう定義
 * @param node
 * @returns
 */
export const isFunctionExpression = (node: ts.Node): boolean => {
  return [ts.isFunctionExpression, ts.isArrowFunction].some((check) => check(node));
};

/**
 * nodeがtrue/false/null等
 * @param node
 * @returns
 */
export const isSyntaxKindExpression = (node: ts.Node): boolean => {
  return SyntaxKinds.some((kind) => node.kind === kind);
};

/**
 * nodeが[]など
 * @param node
 * @returns
 */
export const isArrayLiteralExpression = (node: ts.Node): node is ts.ArrayLiteralExpression => {
  return ts.isArrayLiteralExpression(node);
};

/**
 * nodeがstring, number
 * @param node
 * @returns
 */
export const isPrimitiveExpression = (node: ts.Node): boolean => {
  return [ts.isStringLiteral, ts.isNumericLiteral].some((check) => check(node));
};

/**
 *
 * @example node.getText() = new (class Klass {})(), new Klass(),
 * @param node
 * @returns
 */
export const isNewExpression = (node: ts.Node): boolean => {
  return ts.isNewExpression(node);
};

/**
 *
 * @example node.getText() = await (() => undefined)();
 * @param node
 * @returns
 */
export const isAwaitExpression = (node: ts.Node): boolean => {
  return ts.isAwaitExpression(node);
};

/**
 * @example node.getText() = (() => undefined)(), (function () {})(), (function my() {})()
 * @param node
 * @returns
 */
export const isCallExpression = (node: ts.Node): boolean => {
  return ts.isCallExpression(node);
};

/**
 * @example node.getText() = {}
 * @param node
 * @returns
 */
export const isObjectLiteralExpression = (node: ts.Node): node is ts.ObjectLiteralExpression => {
  return ts.isObjectLiteralExpression(node);
};

export const isPropertyAssignment = (node: ts.Node): node is ts.PropertyAssignment => {
  return ts.isPropertyAssignment(node);
};

export const isExpression = (node: ts.Node): node is ts.Expression => {
  return [
    isPrimitiveExpression,
    isObjectLiteralExpression,
    isArrayLiteralExpression,
    isCallExpression,
    isNewExpression,
    isSyntaxKindExpression,
    isFunctionExpression,
    isIdentifier,
    isAwaitExpression,
  ].some((check) => check(node));
};
