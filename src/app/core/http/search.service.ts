import { DocumentMap } from 'src/app/shared/models/search-result';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SearchResult } from '../../shared/models/search-result';
import { map } from 'rxjs/operators';
import { ActiveRangeFilters } from '../../shared/models/active-range-filters';
import { AggregationsResultDto } from '../../shared/models/aggregations-result-dto';
import { ExcelExportPayload } from '../../shared/models/export/excel-export-payload';
import { Constants } from 'src/app/shared/constants';
import { SearchClusterResults } from 'src/app/shared/models/search-cluster-result';
import {
  UserLastChangedResource,
  UserLastChangedResources
} from 'src/app/shared/models/user/last-changed-resource-dto';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private readonly baseUrl = environment.dmpCoreApiUrl;
  private readonly pageSize = environment.pageSize;

  constructor(private httpClient: HttpClient) {}

  search(
    searchTerm: string,
    page: number,
    activeAggergationBuckets: Map<string, string[]>,
    activeRangeFilters: ActiveRangeFilters,
    searchIndex: string
  ): Observable<SearchResult> {
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
      apiCallTime: new Date().toUTCString(),
      searchIndex: searchIndex
    };
    //return this.getMockData("./assets/mockdata/api_search_mock.json");
    return this.httpClient.post<SearchResult>(
      this.baseUrl + 'search',
      searchRequestObject
    );
  }

  fetchLastChangedResourcesOfAnUser(
    userEmailAddress: string,
    offset: number
  ): Observable<UserLastChangedResources> {
    const searchRequestObject = {
      from: offset,
      size: this.pageSize,
      aggregationFilters: {
        [Constants.Metadata.HasLastChangeUser]: [userEmailAddress]
      },
      enableHighlighting: false,
      enableAggregation: false,
      enableSuggest: false,
      order: 'desc',
      orderField: Constants.Metadata.LastChangeDateTime,
      searchIndex: 'all',
      searchTerm: '',
      apiCallTime: new Date().toUTCString()
    };

    return this.httpClient
      .post<SearchResult>(this.baseUrl + 'search', searchRequestObject)
      .pipe(
        map((searchResult: SearchResult) => {
          const changedResources = searchResult.hits.hits.map((item) => {
            return {
              resourcePidUri:
                item.source[Constants.Metadata.HasPidUri]['outbound'][0][
                  'value'
                ],
              resourceDefinition:
                item.source[Constants.Metadata.HasResourceDefinition][
                  'outbound'
                ][0]['value'],
              resourceLabel:
                item.source[Constants.Metadata.HasLabel]['outbound'][0][
                  'value'
                ],
              resourceType:
                item.source[Constants.Metadata.EntityType]['outbound'][0][
                  'uri'
                ],
              lifeCycleStatus:
                item.source[Constants.Metadata.LifeCycleStatus]['outbound'][0][
                  'uri'
                ],
              resourceLinkedLifeCycleStatus: item.source[
                'resourceLinkedLifecycleStatus'
              ]
                ? item.source['resourceLinkedLifecycleStatus']['outbound'][0][
                    'uri'
                  ]
                : null
            } as UserLastChangedResource;
          });
          return {
            changedResources,
            total: searchResult.hits.total
          };
        })
      );
  }

  clusterSearchResult(
    searchTerm: string,
    searchIndex: string,
    aggregationFilters: Map<string, string[]>,
    rangeFilters: ActiveRangeFilters
  ): Observable<SearchClusterResults> {
    // internal JS Map object cant be serialized, so you have to convert it to an object
    const aggJson = {};
    aggregationFilters.forEach((value, key) => (aggJson[key] = value));
    const searchRequestObject = {
      from: 0,
      size: 1000,
      searchIndex: searchIndex,
      searchTerm: searchTerm,
      enableSuggest: false,
      aggregationFilters: aggJson,
      rangeFilters: rangeFilters,
      enableHighlighting: false,
      apiCallTime: new Date().toUTCString()
    };
    return this.httpClient.post<SearchClusterResults>(
      this.baseUrl + `search/clusterSearchResult`,
      searchRequestObject
    );
  }

  getAllPidUrisOfSearchResult(
    searchTerm: string,
    activeAggergationBuckets: Map<string, string[]>,
    activeRangeFilters: ActiveRangeFilters,
    searchIndex: string
  ): Observable<string[]> {
    const aggJson = activeAggergationBuckets;

    const searchRequestObject = {
      size: 501,
      searchTerm: searchTerm,
      aggregationFilters: aggJson,
      rangeFilters: activeRangeFilters,
      searchIndex,
      enableHighlighting: false,
      apiCallTime: new Date().toUTCString(),
      enableAggregation: false,
      enableSuggest: false,
      fieldsToReturn: [
        Constants.Metadata.HasPidUri,
        Constants.Metadata.HasLabel
      ]
    };

    return this.httpClient
      .post<SearchResult>(this.baseUrl + 'search', searchRequestObject)
      .pipe(
        map((res) => res.hits.hits.map((hit) => decodeURIComponent(hit.id)))
      );
  }

  searchDocument(pidUri: any): Observable<SearchResult> {
    return this.httpClient
      .get<DocumentMap>(this.baseUrl + 'document?id=' + pidUri)
      .pipe(
        map((result) => {
          var output = {
            hits: {
              hits: [
                {
                  id: pidUri,
                  score: 0,
                  source: result,
                  highlight: {},
                  index: '',
                  innerHits: {},
                  matchedQueries: [],
                  nested: null,
                  primaryTerm: null,
                  routing: null,
                  sequenceNumber: null,
                  sorts: [],
                  type: '_doc',
                  version: 0
                }
              ],
              total: 1
            },
            originalSearchTerm: null,
            suggestedSearchTerm: null,
            aggregations: [], //done
            rangeFilters: [],
            suggest: {},
            took: 0
          };
          return output;
        })
      );
  }

  startExcelExport(requestBody: ExcelExportPayload): Observable<any> {
    const url = environment.colidApiUrl + '/export';
    return this.httpClient.post<any>(url, requestBody);
  }

  fetchAutoCompleteResults(searchTerm: string): Observable<string[]> {
    //return this.getMockData("./assets/mockdata/api_search_suggest_mock.json");
    return this.httpClient
      .get<string[]>(this.baseUrl + 'search/suggest?q=' + searchTerm)
      .pipe(
        map((r) => {
          if (r.length === 0 || searchTerm === r[0]) {
            return r;
          }
          return [searchTerm].concat(r);
        })
      );
  }

  getFilterItems(): Observable<AggregationsResultDto> {
    return this.httpClient.get<AggregationsResultDto>(
      this.baseUrl + 'search/aggregations'
    );
  }

  getMockData(filename: string): Observable<any> {
    return this.httpClient.get<SearchResult>(filename);
  }

  fetchLinkedTableandColumnResourceById(id) {
    const url =
      environment.colidApiUrl +
      `/resource/linkedTableAndColumnResource?pidUri=${id}`;
    return this.httpClient.get<any>(url);
  }

  fetchSchemaUIItems(resourceIdList: any): Observable<any> {
    const uri = this.baseUrl + 'getSchemaUIResource';
    return this.httpClient.post<any>(uri, resourceIdList);
  }
}
