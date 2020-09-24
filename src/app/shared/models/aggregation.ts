import { AggregationBucket } from './aggregation-bucket';

export class Aggregation {
    key: string;
    aggregationType: AggregationType;
    label: string;
    order: number;
    taxonomy: boolean;
    buckets: AggregationBucket[];
}

export enum AggregationType {
  Switch = 'switch',
  Checkbox = 'checkbox',
  DateRange = 'dateRange',
}

