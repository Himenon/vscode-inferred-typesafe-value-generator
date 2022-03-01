import * as tsj from "ts-json-schema-generator";
import { TsjTypeToOneJsonShema } from "./TsjTypeToOneJsonShema";

export type Config = tsj.Config;

export const createParser = tsj.createParser;

export const createFormatter = tsj.createFormatter;

export class SchemaGenerator extends tsj.SchemaGenerator {
  protected appendRootChildDefinitions(rootType: tsj.BaseType, childDefinitions: tsj.StringMap<tsj.Definition>): void {
    const seen = new Set<string>();

    const children = this.typeFormatter
      .getChildren(rootType)
      .filter((child): child is tsj.DefinitionType => child instanceof tsj.DefinitionType)
      .filter((child) => {
        if (!seen.has(child.getId())) {
          seen.add(child.getId());
          return true;
        }
        return false;
      });

    const rootTypeName = rootType.getName();

    const findRootDefinitionType = children.find((child) => child.getName() === rootTypeName);

    if (!findRootDefinitionType) {
      return;
    }
    const converter = new TsjTypeToOneJsonShema();
    const type = findRootDefinitionType.getType();
    childDefinitions[rootTypeName] = converter.getSchema(type);
  }
}
