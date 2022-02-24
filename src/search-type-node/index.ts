import { Detector, DetectorContext } from "./Detector";
import { LineAndColumnComputer } from "./LineAndColumnComputer";
import { createSourceFile } from "../ts-ast-utils/create-source-file";

export type DetectorArgs = {
  filename: string;
  code: string;
  lineNumber: number;
  columNumber: number;
};

export const create = ({ filename, code, lineNumber, columNumber }: DetectorArgs) => {
  const sourceFile = createSourceFile(filename, code);
  const lineAndColumnComputer = new LineAndColumnComputer(code);
  const detectorContext: DetectorContext = {
    lineNumber,
    columNumber,
    sourceFile,
    lineAndColumnComputer,
  };

  const detector = new Detector(detectorContext);
  return {
    bestMatchNode: detector.bestMatchNode,
    getNodeArea: detector.getNodeArea,
  };
};
