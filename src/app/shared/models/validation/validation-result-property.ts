import { ValidationResultSeverity } from "./validation-result-severity";

export class ValidationResultProperty {
  node: string;
  path: string;
  message: string;
  resultSeverity: ValidationResultSeverity;
  type: ValidationResultPropertyType;
}

export enum ValidationResultPropertyType {
  SHACL,
  DUPLICATE,
}
