import { Action, Selector, State, StateContext, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { SearchService } from '../core/http/search.service';
import { SearchResult } from '../shared/models/search-result';
import { Aggregation, AggregationType } from '../shared/models/aggregation';
import { AggregationBucket } from '../shared/models/aggregation-bucket';
import { ActivatedRoute } from '@angular/router';
import { stringMapToJson } from '../shared/converters/string-map-object.converter';
import { finalize, tap, mergeMap, catchError, takeUntil, takeWhile } from 'rxjs/operators';
import { Navigate } from '@ngxs/router-plugin';
import { SetFilterItems } from './filter.state';
import { RangeFilterSelection } from '../shared/models/range-filter';
import { ActiveRangeFilters } from '../shared/models/active-range-filters';
import { DmpException, ErrorCode } from '../shared/models/dmp-exception';
import { of } from 'rxjs';

export class PerformInitialSearch {
  static readonly type = '[Search] PerformInitialSearch';

  constructor(public searchTerm: string, public route: ActivatedRoute) { }
}

export class RefreshRoute {
  static readonly type = '[Search] RefreshRoute';

  constructor() { }
}

export class FetchAutocompleteResults {
  static readonly type = '[Search] FetchAutocompleteResults';

  constructor(public searchText: string) { }
}

export class FetchSearchResult {
  static readonly type = '[Search] FetchSearchResult';

  constructor(public route: ActivatedRoute) {
  }
}

export class FetchNextSearchResult {
  static readonly type = '[Search] FetchNextSearchResult';

  constructor(public route: ActivatedRoute) {
  }
}

export class ChangeSearchText {
  static readonly type = '[Search] ChangeSearchText';

  constructor(public searchText: string, public initialChange: boolean) {
  }
}

export class ChangeActiveRangeFilter {
  static readonly type = '[Search] ChangeActiveRangeFilter';

  constructor(public key: string, public selection: RangeFilterSelection, public initialChange: boolean) {
  }
}

export class OverwriteActiveRangeFilters {
  static readonly type = '[Search] OverwriteActiveRangeFilters';

  constructor(public activeRangeFilters: ActiveRangeFilters, public initialChange: boolean) {
  }
}

export class OverwriteActiveAggregationBuckets {
  static readonly type = '[Search] OverwriteActiveAggregationBuckets';

  constructor(public activeAggregationBuckets: Map<string, string[]>, public initialChange: boolean) {
  }
}

export class ChangePage {
  static readonly type = '[Search] ChangePage';

  constructor(public page: number, public initialChange: boolean) {
  }
}

export class ChangeActiveAggregationBuckets {
  static readonly type = '[Search] ChangeActiveAggregationBuckets';

  constructor(public aggregation: Aggregation, public aggregationBucket: AggregationBucket, public value: any, public initialChange: boolean) {
  }
}

export class ChangeActiveAggregationBucketList {
  static readonly type = '[Search] ChangeActiveAggregationBucketList';

  constructor(public aggregation: Aggregation, public aggregationBuckets: string[], public initialChange: boolean) {
  }
}

export class ResetActiveAggregationBuckets {
  static readonly type = '[Search] ResetActiveAggregationBuckets';

  constructor(public refreshRoute: boolean) { }
}

export interface SearchStateModel {
  searching: boolean;
  autoCompleteResults: string[];
  searchText: string;
  searchTimestamp: Date;
  correctedSearchText: string;
  didYouMean: string;
  searchResult: SearchResult;
  aggregations: Aggregation[];
  activeAggregationBuckets: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  page: number;
  errorCode: ErrorCode;
}

@State<SearchStateModel>({
  name: 'search',
  defaults: {
    searching: false,
    autoCompleteResults: null,
    searchText: null,
    searchTimestamp: null,
    searchResult: null,
    didYouMean: null,
    correctedSearchText: null,
    aggregations: null,
    activeAggregationBuckets: new Map<string, string[]>(),
    activeRangeFilters: {},
    page: 1,
    errorCode: null
  }
})

export class SearchState {

  constructor(private searchService: SearchService, private actions$: Actions) {
  }

  @Selector()
  public static getErrorCode(state: SearchStateModel) {
    return state.errorCode;
  }

  @Selector()
  public static getSearching(state: SearchStateModel) {
    return state.searching;
  }

  @Selector()
  public static getSearchText(state: SearchStateModel) {
    return state.searchText;
  }

  @Selector()
  public static getSearchTimestamp(state: SearchStateModel) {
    return state.searchTimestamp;
  }

  @Selector()
  public static getCorrectedSearchText(state: SearchStateModel) {
    return state.correctedSearchText;
  }

  @Selector()
  public static getDidYouMean(state: SearchStateModel) {
    return state.didYouMean;
  }

  @Selector()
  public static getSearchResult(state: SearchStateModel) {
    return state.searchResult;
  }

  @Selector()
  public static getAutoCompleteResults(state: SearchStateModel) {
    return state.autoCompleteResults;
  }

  @Selector()
  public static getPage(state: SearchStateModel) {
    return state.page;
  }

  @Selector()
  public static getAggregations(state: SearchStateModel) {
    return state.aggregations;
  }

  @Selector()
  public static getActiveRangeFilters(state: SearchStateModel) {
    return state.activeRangeFilters;
  }

  @Selector()
  public static getActiveAggregations(state: SearchStateModel) {
    return state.activeAggregationBuckets;
  }

  @Action(RefreshRoute)
  refreshRoute(ctx: StateContext<SearchStateModel>, action: RefreshRoute) {
    return ctx.dispatch(new Navigate(['/search'], this.buildRouteQueryParamter(ctx)));
  }

  private buildRouteQueryParamter(ctx: StateContext<SearchStateModel>): any {
    const state = ctx.getState();

    const queryParameters = {};
    queryParameters['q'] = state.searchText;
    // convert to string so that query param comparison will work
    queryParameters['p'] = '' + state.page;
    const filterJson = stringMapToJson(state.activeAggregationBuckets);
    if (filterJson) {
      queryParameters['f'] = filterJson;
    }
    if (state.activeRangeFilters && Object.keys(state.activeRangeFilters).length) {
      queryParameters['r'] = JSON.stringify(state.activeRangeFilters);
    }

    return queryParameters;
  }

  @Action(ResetActiveAggregationBuckets)
  resetActiveAggregationBuckets(ctx: StateContext<SearchStateModel>, action: ResetActiveAggregationBuckets) {
    ctx.patchState({
      activeAggregationBuckets: new Map<string, string[]>(),
      activeRangeFilters: {}
    });

    if (action.refreshRoute) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(ChangeActiveRangeFilter)
  changeActiveRangeFilter(ctx: StateContext<SearchStateModel>, action: ChangeActiveRangeFilter) {
    console.log("SearchState changeActiveRangeFilter");

    const newActiveRangeFilters = { ...ctx.getState().activeRangeFilters };
    newActiveRangeFilters[action.key] = action.selection;

    ctx.patchState({
      activeRangeFilters: newActiveRangeFilters
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(OverwriteActiveRangeFilters)
  overwriteActiveRangeFilters(ctx: StateContext<SearchStateModel>, action: OverwriteActiveRangeFilters) {
    console.log("SearchState overwriteActiveRangeFilters");

    ctx.patchState({
      activeRangeFilters: action.activeRangeFilters
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }


  @Action(OverwriteActiveAggregationBuckets)
  overwriteActiveAggregationBuckets(ctx: StateContext<SearchStateModel>, action: OverwriteActiveAggregationBuckets) {
    console.log("SearchState overwriteActiveAggregationBuckets");

    ctx.patchState({
      activeAggregationBuckets: action.activeAggregationBuckets
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(ChangeActiveAggregationBuckets)
  changeActiveAggregationBuckets(ctx: StateContext<SearchStateModel>, action: ChangeActiveAggregationBuckets) {
    console.log("SearchState changeActiveAggregationBuckets");

    const key = action.aggregation.key;
    let activeAggregationBuckets = new Map<string, string[]>(ctx.getState().activeAggregationBuckets);
    const bucketKey = action.aggregationBucket.key;

    // Check if some active aggregation exists
    if (activeAggregationBuckets) {
      const activeAggregations = activeAggregationBuckets.get(action.aggregation.key);
      // Check if aggregations already exist for the current filter that was changed.
      if (activeAggregations) {
        // If the changed filter (bucket) is  in the list, it will be removed. 
        if (activeAggregations.some(r => r === bucketKey)) {
          const filteredActiveAggregations = activeAggregations.filter(r => r !== bucketKey);

          if (filteredActiveAggregations.length !== 0) {
            activeAggregationBuckets.set(key, filteredActiveAggregations);
          }
          // If no active aggregations exists, the empty aggregation list is completely deleted 
          else {
            activeAggregationBuckets.delete(key);
          }
        }
        // Otherwise, if the changed filter is not in the list, it will be added to the active buckets.
        else {
          activeAggregations.push(bucketKey);
          activeAggregationBuckets.set(key, activeAggregations);
        }
      } else {
        activeAggregationBuckets.set(key, [bucketKey]);
      }
    } else {
      activeAggregationBuckets = new Map<string, string[]>();
      activeAggregationBuckets.set(key, [bucketKey]);
    }

    ctx.patchState({
      activeAggregationBuckets: activeAggregationBuckets
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(ChangeActiveAggregationBucketList)
  changeActiveAggregationBucketList(ctx: StateContext<SearchStateModel>, action: ChangeActiveAggregationBucketList) {
    console.log("SearchState ChangeActiveAggregationBucketList");

    const key = action.aggregation.key;
    let activeAggregationBuckets = new Map<string, string[]>(ctx.getState().activeAggregationBuckets);


    if (activeAggregationBuckets) {
      const activeAggregation = activeAggregationBuckets.get(action.aggregation.key);

      if (activeAggregation) {
        if (action.aggregationBuckets.length !== 0) {
          activeAggregationBuckets.set(key, action.aggregationBuckets);
        } else {
          activeAggregationBuckets.delete(key);
        }
      } else {
        activeAggregationBuckets.set(key, action.aggregationBuckets);
      }
    } else {
      activeAggregationBuckets = new Map<string, string[]>();
      activeAggregationBuckets.set(key, action.aggregationBuckets);
    }

    ctx.patchState({
      activeAggregationBuckets: activeAggregationBuckets
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(ChangeSearchText)
  changeSearchText(ctx: StateContext<SearchStateModel>, action: ChangeSearchText) {
    console.log("SearchState changeSearchText");

    ctx.patchState({
      searchText: action.searchText,
      searchTimestamp: new Date(),
      page: 1
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(ChangePage)
  changePage(ctx: StateContext<SearchStateModel>, action: ChangePage) {
    console.log("SearchState changePage");
    ctx.patchState({
      page: action.page
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute())
    }
  }

  @Action(FetchSearchResult)
  fetchSearchResult({ getState, patchState, dispatch }: StateContext<SearchStateModel>, action: FetchSearchResult) {
    console.log("SearchState fetchSearchResult");

    patchState({
      searchResult: null,
      searching: true,
      didYouMean: null
    });

    const queryParams = action.route.snapshot.queryParams;
    const searchTerm: string = queryParams['q'];
    const page = queryParams['p'] == null ? 1 : queryParams['p'];
    const activeAggergationBuckets = queryParams['f'] == null ? queryParams['f'] : JSON.parse(queryParams['f']);
    const activeRangeFilters = queryParams['r'] == null ? queryParams['r'] : JSON.parse(queryParams['r']);

    return this.searchService.search(searchTerm, page, activeAggergationBuckets, activeRangeFilters)
      .pipe(
        tap(s => {
          let didYouMean = null;
          try {
            const firstSuggest = Object.values(s.suggest)[0][0];
            if (firstSuggest && firstSuggest.options && firstSuggest.options.length) {
              didYouMean = firstSuggest.options[0].text;
            }
          } catch (e) {
            console.log('Could not get dym', e);
          }
          const stateUpdates = {
            searchResult: s,
            aggregations: s.aggregations,
            correctedSearchText: s.suggestedSearchTerm,
            didYouMean: didYouMean,
            errorCode: null
          };
          patchState(stateUpdates);
        }),
        mergeMap(s => dispatch(new SetFilterItems(s.aggregations, s.rangeFilters))),
        catchError((err) => {
          const dmpEx = err.error as DmpException;
          patchState({ errorCode: dmpEx.errorCode });
          return of(err);
        }),
        finalize(() => {
          patchState({ searching: false });
        })
      );
  }

  @Action(FetchNextSearchResult)
  fetchNextSearchResult({ getState, patchState, dispatch }: StateContext<SearchStateModel>, action: FetchNextSearchResult) {
    console.log("SearchState fetchNextSearchResult");

    const state = getState();
    const newPage = state.page + 1;

    const queryParams = action.route.snapshot.queryParams;
    const searchTerm: string = queryParams['q'];
    const activeAggergationBuckets = queryParams['f'] == null ? queryParams['f'] : JSON.parse(queryParams['f']);
    const activeRangeFilters = queryParams['r'] == null ? queryParams['r'] : JSON.parse(queryParams['r']);

    return this.searchService.search(searchTerm, newPage, activeAggergationBuckets, activeRangeFilters)
      .pipe(
        tap(s => {
          let didYouMean = null;
          try {
            const firstSuggest = Object.values(s.suggest)[0][0];
            if (firstSuggest && firstSuggest.options && firstSuggest.options.length) {
              didYouMean = firstSuggest.options[0].text;
            }
          } catch (e) {
            console.log('Could not get dym', e);
          }
          const oldResult = getState().searchResult;

          const mergedResult = [...oldResult.hits.hits, ...s.hits.hits];
          s.hits.hits = mergedResult;

          patchState({
            searchResult: { ...s },
            didYouMean: didYouMean,
            page: newPage
          });
        }),
        // mergeMap(s => dispatch(new SetFilterItems(s.aggregations, s.rangeFilters))),
        catchError((err) => {
          const dmpEx = err.error as DmpException;
          patchState({ errorCode: dmpEx.errorCode });
          return of(err);
        })
      );
  }

  @Action(FetchAutocompleteResults)
  fetchAutocompleteResults({ getState, patchState }: StateContext<SearchStateModel>, { searchText }: FetchAutocompleteResults) {
    console.log("SearchState fetchAutocompleteResults");
    if (searchText) {
      return this.searchService.fetchAutoCompleteResults(searchText)
        .pipe(
          tap((result) => {
            patchState({
              autoCompleteResults: result
            });
          }),
          takeUntil(this.actions$.pipe(ofActionDispatched(FetchAutocompleteResults, FetchSearchResult)))
        )
    } else {
      patchState({
        autoCompleteResults: null
      });
    }
  }
}
