import { BusinessException } from "../business-exception";

export class MissingParameterException extends BusinessException {
  paramaters: Array<string>;
}
