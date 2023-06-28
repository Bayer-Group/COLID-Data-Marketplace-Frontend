import { BaseEntityResultDTO } from "./base-entity-result-dto";
import { ValidationResult } from "../validation/validation-result";

export class BaseEntityResultCTO {
  entity: BaseEntityResultDTO;
  validationResult: ValidationResult;
}
