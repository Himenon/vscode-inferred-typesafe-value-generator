import * as ts from "typescript";
import type { CreateTransformerFactory, Expression } from "./expression-transformer";
import * as TypeCheck from "./type-check";
import { cloneNode } from "ts-clone-node";

export interface MergeArgs {
  differentType: boolean;
  correctTypeNode: ts.Node;
  originalValueTypeNode: ts.Node;
}

type CreateVisit = (originalValueTypeNode: ts.Node) => (correctTypeNode: ts.Node) => ts.Node;

/**
 * correctTypeが"text", 1の場合
 * @param args
 * @returns
 */
const mergePrimtiveExpression = (args: MergeArgs) => {
  const { differentType, originalValueTypeNode, correctTypeNode } = args;
  if (TypeCheck.isIdentifier(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isAwaitExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isCallExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  // @example new Klass()
  if (TypeCheck.isNewExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  // 変数定義よりも優先度が低い。// 型定義が異なる場合は正しい方を最優先で合わせる
  if (differentType) {
    return cloneNode(correctTypeNode);
  }
  return cloneNode(originalValueTypeNode);
};

/**
 * correctTypeがtrue/false/nullなどのKeywordの場合
 * @param args
 * @returns
 */
const mergeSyntaxKindExpression = (args: MergeArgs) => {
  const { differentType, originalValueTypeNode, correctTypeNode } = args;
  if (TypeCheck.isIdentifier(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isAwaitExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isCallExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  // @example new Klass()
  if (TypeCheck.isNewExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  // SyntaxKindが直接比較の対象の場合は型は同じなため、値が異なる場合は既存のものに合わせる
  if (differentType && TypeCheck.isSyntaxKindExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  return cloneNode(correctTypeNode);
};

const getKeyTextFromPropertyName = (propertyName: ts.PropertyName) => {
  if (ts.isIdentifier(propertyName)) {
    return propertyName.getText();
  }
  if (ts.isNumericLiteral(propertyName)) {
    return propertyName.getText();
  }
  if (ts.isStringLiteral(propertyName)) {
    const text = propertyName.getText();
    if (text.startsWith(`"`) && text.endsWith(`"`)) {
      return text.replace(/^"/, "").replace(/"$/, "");
    }
    if (text.startsWith(`'`) && text.endsWith(`'`)) {
      return text.replace(/^'/, "").replace(/'$/, "");
    }
    return text.replace(/^'/, "").replace(/'$/, "");
  }
  if (ts.isComputedPropertyName(propertyName)) {
    return propertyName.expression.getText();
  }
  throw new Error(`What?`);
};

const firstFallbackTypeNode = (originalValueTypeNode: ts.Node, correctTypeNode: ts.Node) => {
  if (TypeCheck.isIdentifier(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isAwaitExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isCallExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  if (TypeCheck.isNewExpression(originalValueTypeNode)) {
    return cloneNode(originalValueTypeNode);
  }
  return cloneNode(correctTypeNode);
};

const mergeArrayExpression = (
  originalValueTypeNode: ts.ArrayLiteralExpression,
  correctTypeNode: ts.ArrayLiteralExpression
): ts.ArrayLiteralExpression => {
  const correctTypeNodeArray: ts.Expression[] = [];
  const originalSpreadElements: { index: number; node: ts.SpreadElement }[] = [];
  correctTypeNode.forEachChild((item) => {
    if (TypeCheck.isExpression(item)) {
      correctTypeNodeArray.push(item);
    }
  });
  const mergedElements: (ts.Expression | ts.SpreadElement)[] = [];
  originalValueTypeNode.forEachChild((originalItem) => {
    if (ts.isSpreadElement(originalItem)) {
      mergedElements.push(originalItem);
    }
    if (!TypeCheck.isExpression(originalItem)) {
      return;
    }
    const visit = createVisit(originalItem);
    let mergedNode: ts.Expression | undefined;
    let fallbackNode: ts.Expression | undefined;
    for (const correctItem of correctTypeNodeArray) {
      if (correctItem.kind === originalItem.kind) {
        mergedNode = ts.visitNode(correctItem, visit);
        continue;
      } else {
        fallbackNode = ts.visitNode(correctItem, visit);
      }
    }
    const updateNode = mergedNode || fallbackNode;
    if (updateNode) {
      mergedElements.push(updateNode);
    }
  });
  const newArrayLiteral = ts.factory.updateArrayLiteralExpression(correctTypeNode, mergedElements);
  return cloneNode(newArrayLiteral);
};

/**
 * Objectの型定義マージ
 *
 * @param originalValueTypeNode
 * @param correctTypeNode
 * @returns
 */
const mergeObjectExpression = (
  originalValueTypeNode: ts.ObjectLiteralExpression,
  correctTypeNode: ts.ObjectLiteralExpression
): ts.ObjectLiteralExpression => {
  const originalValueTypeNodePropertyAssignments: (ts.PropertyAssignment | ts.ShorthandPropertyAssignment)[] = [];
  const originalSpreadAssignments: { index: number; node: ts.SpreadAssignment }[] = [];
  let counter = 0;
  let maxCount = 0;
  originalValueTypeNode.forEachChild((child) => {
    if (ts.isPropertyAssignment(child) || ts.isShorthandPropertyAssignment(child)) {
      originalValueTypeNodePropertyAssignments.push(child);
    }
    if (ts.isSpreadAssignment(child)) {
      originalSpreadAssignments.push({
        index: counter,
        node: child,
      });
    }
    maxCount = counter;
    counter += 1;
  });

  counter = 0; // reset
  const mergedCorrectTypeNodePropertyAssignments: (ts.PropertyAssignment | ts.ShorthandPropertyAssignment | ts.SpreadAssignment)[] = [];
  correctTypeNode.forEachChild((correctTypeNodePropertyAssignment) => {
    const originalSpreadAssignmentItem = originalSpreadAssignments.find((item) => item.index === counter);
    if (originalSpreadAssignmentItem) {
      mergedCorrectTypeNodePropertyAssignments.push(originalSpreadAssignmentItem.node);
    }
    counter += 1;
    if (!ts.isPropertyAssignment(correctTypeNodePropertyAssignment)) {
      return;
    }
    const searchKey = getKeyTextFromPropertyName(correctTypeNodePropertyAssignment.name);
    // 現在のkeyでスプレッドオペレータがすでに鉢されている場合、スキップする
    if (originalSpreadAssignmentItem && searchKey === originalSpreadAssignmentItem.node.expression.getText()) {
      return;
    }

    const originalValueTypeNodePropertyAssignment = originalValueTypeNodePropertyAssignments.find((original) => {
      return getKeyTextFromPropertyName(original.name) === searchKey;
    });

    // originalにspread operatorが存在する場合は、新規にCorrectTypeNodeを追加することをキャンセルする
    const cancelMergeCorrectTypeNodeProperty = !originalValueTypeNodePropertyAssignment && originalSpreadAssignments.length > 0;

    if (!originalValueTypeNodePropertyAssignment) {
      if (cancelMergeCorrectTypeNodeProperty) {
        return;
      }
      const newPropertyAssignment = cloneNode(correctTypeNodePropertyAssignment);
      mergedCorrectTypeNodePropertyAssignments.push(newPropertyAssignment);
    } else if (ts.isPropertyAssignment(originalValueTypeNodePropertyAssignment)) {
      const visit = createVisit(originalValueTypeNodePropertyAssignment.initializer);
      const newInitializer = ts.visitNode(correctTypeNodePropertyAssignment.initializer, visit);
      const newPropertyAssignment = ts.factory.updatePropertyAssignment(
        correctTypeNodePropertyAssignment,
        cloneNode(correctTypeNodePropertyAssignment.name),
        newInitializer
      );
      mergedCorrectTypeNodePropertyAssignments.push(newPropertyAssignment);
    } else if (ts.isShorthandPropertyAssignment(originalValueTypeNodePropertyAssignment)) {
      mergedCorrectTypeNodePropertyAssignments.push(originalValueTypeNodePropertyAssignment);
    }
  });

  while (counter <= maxCount) {
    const originalSpreadAssignmentItem = originalSpreadAssignments.find((item) => item.index === counter);
    if (originalSpreadAssignmentItem) {
      mergedCorrectTypeNodePropertyAssignments.push(originalSpreadAssignmentItem.node);
    }
    counter += 1;
  }
  return ts.factory.updateObjectLiteralExpression(correctTypeNode, mergedCorrectTypeNodePropertyAssignments);
};

const createVisit: CreateVisit = (originalValueTypeNode: ts.Node) => (correctTypeNode: ts.Node) => {
  const sameType = correctTypeNode.kind === originalValueTypeNode.kind;
  const differentType = !sameType;
  const mergeArgs: MergeArgs = { differentType, correctTypeNode, originalValueTypeNode };
  // @example "text", 1
  if (TypeCheck.isPrimitiveExpression(correctTypeNode)) {
    return mergePrimtiveExpression(mergeArgs);
  }
  // @example true, false, null
  if (TypeCheck.isSyntaxKindExpression(correctTypeNode)) {
    return mergeSyntaxKindExpression(mergeArgs);
  }
  if (TypeCheck.isArrayLiteralExpression(correctTypeNode)) {
    if (!TypeCheck.isArrayLiteralExpression(originalValueTypeNode)) {
      return firstFallbackTypeNode(originalValueTypeNode, correctTypeNode);
    }
    return mergeArrayExpression(originalValueTypeNode, correctTypeNode);
  }
  if (TypeCheck.isObjectLiteralExpression(correctTypeNode)) {
    if (!TypeCheck.isObjectLiteralExpression(originalValueTypeNode)) {
      return firstFallbackTypeNode(originalValueTypeNode, correctTypeNode);
    }
    return mergeObjectExpression(originalValueTypeNode, correctTypeNode);
  }
  return cloneNode(correctTypeNode);
};

export const merge: CreateTransformerFactory<Expression> = (originalValueTypeNode) => (context: ts.TransformationContext) => (rootNode) => {
  const visit = createVisit(originalValueTypeNode);
  return ts.visitNode(rootNode, visit);
};
