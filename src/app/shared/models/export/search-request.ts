export interface SearchRequest {
  searchTerm: string;
  from: number;
  size: number;
  aggregationFilters: any;
  rangeFilters: any;
  enableHighlighting: boolean;
  apiCallTime: string;
}
