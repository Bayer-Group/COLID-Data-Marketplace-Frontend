export interface OverallStatisticsRawDto {
  [key: string]: {
    state?: string;
    schedule?: string;
    lastInvocationDate?: string;
  };
}
