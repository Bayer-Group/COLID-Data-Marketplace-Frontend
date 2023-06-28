import { ValidationResultProperty } from "./validation-result-property";
import { ValidationResultSeverity } from "./validation-result-severity";

export class ValidationResult {
  conforms: boolean;
  severity: ValidationResultSeverity;
  results: ValidationResultProperty[];
}

export enum ConformLevel {
  SUCCESS,
  WARNING,
  CRITICAL,
}
