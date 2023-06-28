import { BusinessException } from "../business-exception";

export class InvalidFormatException extends BusinessException {
  id: string;
}
