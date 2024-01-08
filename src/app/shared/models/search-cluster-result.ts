export interface SearchClusterResults {
  clusters: SingleClusterResult[];
}

interface SingleClusterResult {
  labels: string[];
  docDetails: {
    pidUri: string;
    label: string;
  }[];
}
