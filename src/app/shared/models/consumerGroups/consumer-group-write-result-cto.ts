import { BaseEntityResultCTO } from '../entities/base-entity-result-cto';
import { ConsumerGroupResultDTO } from './consumer-group-result-dto';

export class ConsumerGroupWriteResultCTO extends BaseEntityResultCTO {
  entity: ConsumerGroupResultDTO;

  constructor() {
    super();
  }
}
