import { BaseEntityResultDTO } from "../entities/base-entity-result-dto";

export class ConsumerGroupResultDTO extends BaseEntityResultDTO {
  lifecycleStatus: string;

  public constructor() {
    super();
  }
}
