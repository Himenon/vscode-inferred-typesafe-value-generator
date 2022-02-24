import { Schema } from "../Types";
import * as Module from "../Walker";

const sampleJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $ref: "#/definitions/Example",
  definitions: {
    Example: {
      type: "object",
      properties: {
        stringValue0: { type: "string" },
        stringValue1: { type: "string", default: "John Son" },
        stringValue2: { type: "string", enum: ["a", "b", "c"] },
        numberValue0: { type: "number" },
        numberValue1: { type: "number", default: 100 },
        numberValue2: { type: "number", enum: [100, 200, 300] },
        boolValue0: { type: "boolean" },
        boolValue1: { type: "boolean", default: true },
        boolValue2: { type: "boolean", enum: [true] },
        arrayValue0: { type: "array" },
        arrayValue1: { type: "array", items: [{ type: "string", default: "item" }] },
        arrayValue2: { type: "array", items: [{ type: "number", default: 1234 }] },
      },
    },
  },
} as Schema;

describe("Example Values", () => {
  test("examp", () => {
    const walker = new Module.Walker(sampleJsonSchema);
    const { value } = walker.convert(sampleJsonSchema);
    expect(value).toStrictEqual({
      stringValue0: "",
      stringValue1: "John Son",
      stringValue2: "a",
      numberValue0: 0,
      numberValue1: 100,
      numberValue2: 100,
      boolValue0: false,
      boolValue1: true,
      boolValue2: true,
      arrayValue0: [],
      arrayValue1: ["item"],
      arrayValue2: [1234],
    });
  });
});
