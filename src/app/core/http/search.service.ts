import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SearchResult } from '../../shared/models/search-result';
import { map } from 'rxjs/operators';
import { ActiveRangeFilters } from '../../shared/models/active-range-filters';
import { AggregationsResultDto } from '../../shared/models/aggregations-result-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly baseUrl = environment.dmpCoreApiUrl;
  private readonly pageSize = environment.pageSize;

  constructor(private httpClient: HttpClient) { }

  search(searchTerm: string,
    page: number,
    activeAggergationBuckets: Map<string, string[]>,
    activeRangeFilters: ActiveRangeFilters): Observable<SearchResult> {

    if (page < 1) {
      page = 1;
    }

    const fromCurrent = (page - 1) * this.pageSize;

    const aggJson = activeAggergationBuckets;

    const searchRequestObject = {
      from: fromCurrent,
      size: this.pageSize,
      searchTerm: searchTerm,
      aggregationFilters: aggJson,
      rangeFilters: activeRangeFilters,
      enableHighlighting: true,
      apiCallTime: (new Date).toUTCString()
    };
    //return this.getMockData("./assets/mockdata/api_search_mock.json");
    return this.httpClient.post<SearchResult>(this.baseUrl + 'search', searchRequestObject);
  }

  fetchAutoCompleteResults(searchTerm: string): Observable<string[]> {
    //return this.getMockData("./assets/mockdata/api_search_suggest_mock.json");
    return this.httpClient.get<string[]>(this.baseUrl + 'search/suggest?q=' + searchTerm).pipe(map(r => {
      if (r.length === 0 || searchTerm === r[0]) {
        return r;
      }
      return [searchTerm].concat(r);
    }));
  }

  getFilterItems(): Observable<AggregationsResultDto> {
    //return this.getMockData("./assets/mockdata/api_search_aggregations_1_mock.json");
    return this.httpClient.get<AggregationsResultDto>(this.baseUrl + 'search/aggregations');
  }

  getMockData(filename: string): Observable<any> {
    return this.httpClient.get<SearchResult>(filename);
  }
}
