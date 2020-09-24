import { ResourceSearchDTO } from 'src/app/shared/models/resources/resource-search-dto';

export class SearchFilterEditor {
  filterJson: ResourceSearchDTO;

  constructor(searchFilters: ResourceSearchDTO) {
      this.filterJson = searchFilters;
  }
}
