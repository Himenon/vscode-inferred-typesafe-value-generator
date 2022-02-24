import * as ts from "typescript";

export interface GetTypeName {
  isUnknown: boolean;
  firstTypeName: string;
  isArray: boolean;
  intersectinoTypeNames: GetTypeName[];
  isIntersectionType: boolean;
}

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
  return {
    firstTypeName: "unknown",
    isArray: false,
    intersectinoTypeNames: [],
    isIntersectionType: false,
    isUnknown: true,
  };
};
