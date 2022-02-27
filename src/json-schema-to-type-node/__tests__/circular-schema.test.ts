import { Schema } from "../Types";
import * as Module from "../Walker";

const schema: Schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $ref: "#/definitions/Directory",
  definitions: {
    Directory: {
      type: "object",
      properties: {
        children: {
          type: "array",
          items: {
            $ref: "#/definitions/Child",
          },
        },
      },
      required: ["children"],
      additionalProperties: false,
    },
    Child: {
      anyOf: [
        {
          $ref: "#/definitions/Directory",
        },
        {
          $ref: "#/definitions/File",
        },
      ],
    },
    File: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
};

describe("Example Values", () => {
  test("examp", () => {
    const walker = new Module.Walker(schema);
    const { value } = walker.convert(schema);
    expect(value).toStrictEqual({
      children: [
        {
          children: [],
        },
      ],
    });
  });
});
