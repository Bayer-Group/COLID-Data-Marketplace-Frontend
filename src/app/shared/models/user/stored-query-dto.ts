export class StoredQueryDto {
  id: number;
  executionInterval: ExecutionInterval;
  searchFilterDataMarketplaceId: number;
  searchResultHash: string;
  latestExecutionDate: string;
  public constructor(
    executionInterval: ExecutionInterval,
    searchFilterDataMarketplaceId: number = 0
  ) {
    this.executionInterval = executionInterval;
    this.searchFilterDataMarketplaceId = searchFilterDataMarketplaceId;
  }
}

export enum ExecutionInterval {
  Daily,
  Weekly,
  Monthly
}
