import { ActiveRangeFilters } from "../active-range-filters";

export class SearchFilterCollectionDto {
  aggregations: any;
  ranges: ActiveRangeFilters;

  public constructor(aggregations: any, ranges: ActiveRangeFilters) {
    this.aggregations = aggregations;
    this.ranges = ranges;
  }
}
