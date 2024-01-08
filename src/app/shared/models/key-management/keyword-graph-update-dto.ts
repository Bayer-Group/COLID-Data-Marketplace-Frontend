export interface KeywordGraphUpdateDto {
  graph: string;
  saveAsGraph: string;
  saveAsType: string;
  additions: {
    label: string;
  }[];
  deletions: {
    keyId: string;
  }[];
  updations: {
    keyId: string;
    label: string;
  }[];
}
