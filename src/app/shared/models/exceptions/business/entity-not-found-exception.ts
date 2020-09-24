import { BusinessException } from '../business-exception';

export class EntityNotFoundException extends BusinessException {
  id: string;
}
