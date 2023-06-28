import { BusinessException } from "../business-exception";

export class ReferenceException extends BusinessException {
  refernceId: string;
}
