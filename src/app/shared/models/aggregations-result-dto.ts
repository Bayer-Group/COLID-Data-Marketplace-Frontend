import { Aggregation } from './aggregation';
import { RangeFilter } from './range-filter';

export class AggregationsResultDto {
  aggregations: Aggregation[];
  rangeFilters: RangeFilter[];
}

export class AggregationDto {
  buckets: AggregationBucketDto[];
}

export class AggregationBucketDto {
  key: string;
  doc_count: number;
}
