import * as path from "path";
import * as Module from "../index";

const basePath = path.join(__dirname, "./sample-code/");

describe("Popular JSON Schema Test", () => {
  test("Load files directly", () => {
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

  test("Reading files indirectly", () => {
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
