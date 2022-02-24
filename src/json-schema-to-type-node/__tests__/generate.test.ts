import { Schema } from "../Types";
import * as Module from "../Walker";

const sampleJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $ref: "#/definitions/Sample.Config",
  definitions: {
    "Sample.Config": {
      type: "object",
      properties: { name: { type: "string" }, value: { type: "string" } },
      required: ["value"],
      additionalProperties: false,
    },
  },
} as Schema;

describe("dot property", () => {
  test("sampleJsonSchema", () => {
    const walker = new Module.Walker(sampleJsonSchema);
    const { value } = walker.convert(sampleJsonSchema);
    expect(value).toMatchSnapshot();
  });
});
