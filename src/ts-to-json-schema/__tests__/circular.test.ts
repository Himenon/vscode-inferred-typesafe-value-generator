import * as path from "path";
import * as Module from "../index";

const basePath = path.join(__dirname, "./sample-code");

describe("Popular JSON Schema Test", () => {
  test("Load files directly", () => {
    const schema = Module.generateJsonSchema({
      files: [path.join(basePath, "./circular-dependency.ts")],
      typeName: {
        isUnknown: false,
        firstTypeName: "Directory",
        isArray: false,
        intersectinoTypeNames: [],
        isIntersectionType: false,
      },
      basePath,
    });
    expect(schema).toMatchSnapshot();
  });
});
