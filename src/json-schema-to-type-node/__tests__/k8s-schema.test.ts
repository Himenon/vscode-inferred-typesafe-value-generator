import * as Module from "../Walker";
import { Schema } from "../Types";
import schema from "./k8s-schema.json";

const jsonSchema = schema as Schema;

describe("Kubernetes Schema", () => {
  test("Kubernetes Schema", () => {
    const walker = new Module.Walker(jsonSchema);
    const { value } = walker.convert(jsonSchema);
    expect(value).toMatchSnapshot();
  });
});
