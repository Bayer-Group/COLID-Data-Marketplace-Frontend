import { Aggregation } from './aggregation';
import { RangeFilter } from './range-filter';
export interface SuggestMap {
  [key: string]: Suggest;
}
export interface StringArrayMap {
  [key: string]: string[];
}

export class SearchResult {
  hits: SearchHits;
  suggest: SuggestMap;
  originalSearchTerm: string;
  suggestedSearchTerm: string;
  aggregations: Aggregation[];
  rangeFilters: RangeFilter[];
  took: number;
}

export class SearchHits {
  hits: SearchHit[];
  total: number;
}

export class SearchHit {
  id: string;
  score: number;
  source: DocumentMap;
  highlight: StringArrayMap;
}

export interface DocumentMaps {
  [key: string]: DocumentMap[];
}

export interface DocumentMap {
  [key: string]: DocumentMapDirection;
}

export class DocumentMapDirection {
  outbound: Document[];
  inbound: Document[];
}

export class Document {
  uri: string;
  value: any;
  edge: string;
}

export class Metadata {
  hasPID: string;
  name: string;
  description: string;
  type: string;
  nodeType: string;
  order: number;
  group: MetadataGroup;
  isMandatory: boolean;
  maxCount: number;
}

export class MetadataGroup {
  label: string;
  order: number;
}

export class Suggest {
  text: string;
  offset: number;
  length: 9;
  options: SuggestOption[];
}

export class SuggestOption {
  text: string;
  score: number;
}
