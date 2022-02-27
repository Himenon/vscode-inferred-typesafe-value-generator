import * as path from "path";
import * as Module from "../index";

const basePath = path.join(__dirname, "./sample-code");

describe.skip("Multi Type Test", () => {
  test("Load files directly", () => {
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
