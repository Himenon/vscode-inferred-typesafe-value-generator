import * as path from "path";
import * as Module from "../index";

const basePath = __dirname;

describe("JSON Schema", () => {
  test("types.ts", () => {
    const schema = Module.generateJsonSchema({
      files: [path.join(basePath, "./types.ts")],
      typeName: {
        isUnknown: false,
        firstTypeName: "ServerSideConfig",
        isArray: false,
        intersectinoTypeNames: [],
        isIntersectionType: false,
      },
      basePath,
    });
    expect(schema).toMatchSnapshot();
  });

  test("sample.ts", () => {
    const schema = Module.generateJsonSchema({
      files: [path.join(basePath, "./sample.ts")],
      typeName: {
        isUnknown: false,
        firstTypeName: "ServerSideConfig",
        isArray: false,
        intersectinoTypeNames: [],
        isIntersectionType: false,
      },
      basePath,
    });
    expect(schema).toMatchSnapshot();
  });
});
