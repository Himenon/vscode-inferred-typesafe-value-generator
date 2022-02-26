import * as ts from "typescript";

export interface GetTypeName {
  isUnknown: boolean;
  firstTypeName: string;
  isPrimtive?: true;
  isArray: boolean;
  intersectinoTypeNames: GetTypeName[];
  isIntersectionType: boolean;
}

const PrimitiveNameMap = {
  [ts.SyntaxKind.NumberKeyword.toString()]: "number",
  [ts.SyntaxKind.BooleanKeyword.toString()]: "boolean",
  [ts.SyntaxKind.StringKeyword.toString()]: "string",
};

export const getTypeName = (node: ts.Node): GetTypeName => {
  if (ts.isTypeReferenceNode(node)) {
    return {
      firstTypeName: node.getText(),
      isArray: false,
      intersectinoTypeNames: [],
      isIntersectionType: false,
      isUnknown: false,
    };
  }
  if (ts.isParenthesizedTypeNode(node)) {
    return getTypeName(node.type);
  }
  if (ts.isUnionTypeNode(node) && node.types.length > 0) {
    return getTypeName(node.types[0]);
  }
  if (ts.isArrayTypeNode(node)) {
    return {
      firstTypeName: node.elementType.getText(),
      isArray: true,
      intersectinoTypeNames: [],
      isIntersectionType: false,
      isUnknown: false,
    };
  }
  if (ts.isIntersectionTypeNode(node)) {
    const intersectinoTypeNames = node.types.map(getTypeName);
    return {
      firstTypeName: intersectinoTypeNames[0].firstTypeName,
      isArray: false,
      intersectinoTypeNames: intersectinoTypeNames,
      isIntersectionType: true,
      isUnknown: false,
    };
  }
  if (Object.keys(PrimitiveNameMap).includes(node.kind.toString())) {
    return {
      firstTypeName: PrimitiveNameMap[node.kind.toString()],
      isPrimtive: true,
      isArray: false,
      intersectinoTypeNames: [],
      isIntersectionType: false,
      isUnknown: false,
    };
  }
  return {
    firstTypeName: "unknown",
    isArray: false,
    intersectinoTypeNames: [],
    isIntersectionType: false,
    isUnknown: true,
  };
};
