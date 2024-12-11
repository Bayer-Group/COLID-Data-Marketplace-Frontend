import { TaxonomyResultDTO } from './taxonomy/taxonomy-result-dto';

export class TreeViewSelectionChangeEvent {
  initialChange: boolean;
  values: Array<TaxonomyResultDTO>;
}
