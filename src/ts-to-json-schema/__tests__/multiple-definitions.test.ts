import * as path from "path";
import * as Module from "../index";

const basePath = path.join(__dirname, "./sample-code");

describe("Multi Type Test", () => {
  test("Not thorw Error", () => {
    expect(() => {
      Module.generateJsonSchema({
        files: [path.join(basePath, "./sample.ts")],
        typeName: {
          isUnknown: false,
          firstTypeName: "SameTypeConfig",
          isArray: false,
          intersectinoTypeNames: [],
          isIntersectionType: false,
        },
        basePath,
      });
    }).not.toThrow();
  });

  test("Schema Snapshot", () => {
    const schema = Module.generateJsonSchema({
      files: [path.join(basePath, "./sample.ts")],
      typeName: {
        isUnknown: false,
        firstTypeName: "SameTypeConfig",
        isArray: false,
        intersectinoTypeNames: [],
        isIntersectionType: false,
      },
      basePath,
    });
    expect(schema).toMatchSnapshot();
  });
});
