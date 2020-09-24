import { SearchFilterCollectionDto } from './search-filter-collection-dto';

export class SearchFilterDataMarketplaceDto {
  id: number;
  name: string;
  filterJson: SearchFilterCollectionDto;

  public constructor(name: string, filterJson: any) {
    this.name = name;
    this.filterJson = filterJson;
  }
}
