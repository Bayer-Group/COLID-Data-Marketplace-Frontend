import { Aggregation } from '../aggregation';
import { FilterGroupingOrderRaw } from './filter-grouping-order-raw';

export interface FilterGroupingOrder extends FilterGroupingOrderRaw {
  expanded: boolean;
  filters: {
    propertyOrder: number;
    propertyUri: string;
    aggregation: Aggregation;
  }[];
}
