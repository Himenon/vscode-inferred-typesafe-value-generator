interface Square {
  kind: "square";
  size: number;
}

interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

export type Shape = Square | Rectangle;

const shape: Shape = {
  kind: "square",
  size: 0,
};
