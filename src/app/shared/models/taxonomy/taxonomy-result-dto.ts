import { BaseEntityResultDTO } from '../entities/base-entity-result-dto';

export class TaxonomyResultDTO extends BaseEntityResultDTO {
  hasParent: boolean;
  hasChild: boolean;
  children: TaxonomyResultDTO[];
  level: number = 0;

  public constructor() {
    super();
  }
}
