import {
  Action,
  Selector,
  State,
  StateContext,
  Actions,
  ofActionDispatched,
  Store,
} from "@ngxs/store";
import { SearchService } from "../core/http/search.service";
import { SearchResult } from "../shared/models/search-result";
import { Aggregation } from "../shared/models/aggregation";
import { AggregationBucket } from "../shared/models/aggregation-bucket";
import { ActivatedRoute } from "@angular/router";
import { stringMapToJson } from "../shared/converters/string-map-object.converter";
import {
  finalize,
  tap,
  catchError,
  takeUntil,
  switchMap,
} from "rxjs/operators";
import { Navigate } from "@ngxs/router-plugin";
import { SetFilterItems } from "./filter.state";
import { RangeFilterSelection } from "../shared/models/range-filter";
import { ActiveRangeFilters } from "../shared/models/active-range-filters";
import { DmpException, ErrorCode } from "../shared/models/dmp-exception";
import { combineLatest, of } from "rxjs";
import { FetchColidEntrySubscriptionNumbers } from "./colid-entry-subcriber-count.state";
import { SchemeUi } from "../shared/models/schemeUI";
import { Injectable } from "@angular/core";
//import { SchemeUi } from '../shared/models/schemeUI';

export class PerformInitialSearch {
  static readonly type = "[Search] PerformInitialSearch";

  constructor(public searchTerm: string, public route: ActivatedRoute) {}
}

export class RefreshRoute {
  static readonly type = "[Search] RefreshRoute";

  constructor() {}
}

export class AddSelectedPIDURI {
  static readonly type = "[Search] Add selected PID URI";
  constructor(public selectedPIDURI: string) {}
}

export class AddSelectedPIDURIs {
  static readonly type = "[Search] Add selected PID URIs";
  constructor(public selectedPIDURIs: string[]) {}
}

export class RemoveSelectedPIDURI {
  static readonly type = "[Search] Remove selected PID URI";
  constructor(public selectedPIDURI: string) {}
}

export class ClearSelectedPIDURIs {
  static readonly type = "[Search] Clear selected PID URIs";
  constructor() {}
}

export class FetchAutocompleteResults {
  static readonly type = "[Search] FetchAutocompleteResults";

  constructor(public searchText: string) {}
}

export class FetchSearchResult {
  static readonly type = "[Search] FetchSearchResult";

  constructor(public route: ActivatedRoute) {}
}

export class FetchNextSearchResult {
  static readonly type = "[Search] FetchNextSearchResult";

  constructor(public route: ActivatedRoute) {}
}

export class ChangeSearchText {
  static readonly type = "[Search] ChangeSearchText";

  constructor(public searchText: string, public initialChange: boolean) {}
}

export class SearchByPidUri {
  static readonly type = "[Search] Search by PID URI";
  constructor(public pidUri: string) {}
}

export class ChangeActiveRangeFilter {
  static readonly type = "[Search] ChangeActiveRangeFilter";

  constructor(
    public key: string,
    public selection: RangeFilterSelection,
    public initialChange: boolean
  ) {}
}

export class ResetSingleActiveRangeFilter {
  static readonly type = "[Search] ResetSingleActiveRangeFilter";

  constructor(public key: string, public initialChange: boolean) {}
}

export class OverwriteActiveRangeFilters {
  static readonly type = "[Search] OverwriteActiveRangeFilters";

  constructor(
    public activeRangeFilters: ActiveRangeFilters,
    public initialChange: boolean
  ) {}
}

export class OverwriteActiveAggregationBuckets {
  static readonly type = "[Search] OverwriteActiveAggregationBuckets";

  constructor(
    public activeAggregationBuckets: Map<string, string[]>,
    public initialChange: boolean
  ) {}
}

export class ChangePage {
  static readonly type = "[Search] ChangePage";

  constructor(public page: number, public initialChange: boolean) {}
}

export class ChangeActiveAggregationBuckets {
  static readonly type = "[Search] ChangeActiveAggregationBuckets";

  constructor(
    public aggregation: Aggregation,
    public aggregationBucket: AggregationBucket,
    public value: any,
    public initialChange: boolean
  ) {}
}

export class ChangeActiveAggregationBucketList {
  static readonly type = "[Search] ChangeActiveAggregationBucketList";

  constructor(
    public aggregation: Aggregation,
    public aggregationBuckets: string[],
    public initialChange: boolean
  ) {}
}

export class ResetActiveAggregationBuckets {
  static readonly type = "[Search] ResetActiveAggregationBuckets";

  constructor(public refreshRoute: boolean) {}
}

export class FetchLinkedTableandColumnResults {
  static readonly type = "[Search] FetchLinkedTableandColumnResults";

  constructor(public id: string) {}
}

export class FetchSchemaUIResults {
  static readonly type = "[Search] FetchSchemaUIResults";

  constructor(public displayTableAndColumn: SchemeUi) {}
}

export interface SearchStateModel {
  searching: boolean;
  autoCompleteResults: string[];
  searchText: string;
  searchTimestamp: Date;
  correctedSearchText: string;
  didYouMean: string;
  searchResult: SearchResult;
  searchResultPidUris: string[];
  aggregations: Aggregation[];
  activeAggregationBuckets: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  page: number;
  errorCode: ErrorCode;
  linkedTableAndcolumnResource: any;
  loading: boolean;
  errorSchema: any;
  schemaUIDetail: any;
  selectedPIDURIs: string[];
}

@State<SearchStateModel>({
  name: "search",
  defaults: {
    searching: false,
    autoCompleteResults: null,
    searchText: null,
    searchTimestamp: null,
    searchResult: null,
    searchResultPidUris: null,
    didYouMean: null,
    correctedSearchText: null,
    aggregations: null,
    activeAggregationBuckets: new Map<string, string[]>(),
    activeRangeFilters: {},
    page: 1,
    errorCode: null,
    linkedTableAndcolumnResource: null,
    loading: false,
    errorSchema: null,
    schemaUIDetail: null,
    selectedPIDURIs: [],
  },
})
@Injectable()
export class SearchState {
  constructor(
    private store: Store,
    private searchService: SearchService,
    private actions$: Actions
  ) {}

  @Selector()
  public static getErrorCode(state: SearchStateModel) {
    return state.errorCode;
  }

  @Selector()
  public static getSelectedPIDURIs(state: SearchStateModel) {
    return state.selectedPIDURIs;
  }

  @Selector()
  public static getErrorSchema(state: SearchStateModel) {
    return state.errorSchema;
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
  public static getAllPidUrisOfSearchResult(state: SearchStateModel) {
    return state.searchResultPidUris;
  }

  @Selector()
  public static getDocumentResult(state: SearchStateModel) {
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
  refreshRoute(ctx: StateContext<SearchStateModel>) {
    return ctx.dispatch(
      new Navigate(["/search"], this.buildRouteQueryParamter(ctx))
    );
  }

  @Selector()
  public static getLinkedTableAndColumnResource(state: SearchStateModel) {
    return state.linkedTableAndcolumnResource;
  }

  @Selector()
  public static getschemaUIDetailResource(state: SearchStateModel) {
    return state.schemaUIDetail;
  }

  @Selector()
  public static getLoading(state: SearchStateModel) {
    return state.loading;
  }

  private buildRouteQueryParamter(ctx: StateContext<SearchStateModel>): any {
    const state = ctx.getState();

    const queryParameters = {};
    queryParameters["q"] = state.searchText ? state.searchText : "";
    // convert to string so that query param comparison will work
    queryParameters["p"] = "" + state.page;
    var activeAggregationBucketsCopy = state.activeAggregationBuckets;
    activeAggregationBucketsCopy.forEach((x) => x.sort());
    const filterJson = stringMapToJson(activeAggregationBucketsCopy);
    if (filterJson) {
      queryParameters["f"] = filterJson;
    }
    if (
      state.activeRangeFilters &&
      Object.keys(state.activeRangeFilters).length
    ) {
      queryParameters["r"] = JSON.stringify(state.activeRangeFilters);
    }

    return queryParameters;
  }

  @Action(ResetActiveAggregationBuckets)
  resetActiveAggregationBuckets(
    ctx: StateContext<SearchStateModel>,
    action: ResetActiveAggregationBuckets
  ) {
    ctx.patchState({
      activeAggregationBuckets: new Map<string, string[]>(),
      activeRangeFilters: {},
    });

    if (action.refreshRoute) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ChangeActiveRangeFilter)
  changeActiveRangeFilter(
    ctx: StateContext<SearchStateModel>,
    action: ChangeActiveRangeFilter
  ) {
    const newActiveRangeFilters = { ...ctx.getState().activeRangeFilters };
    newActiveRangeFilters[action.key] = action.selection;

    ctx.patchState({
      activeRangeFilters: newActiveRangeFilters,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ResetSingleActiveRangeFilter)
  resetSingleActiveRangeFilter(
    ctx: StateContext<SearchStateModel>,
    action: ResetSingleActiveRangeFilter
  ) {
    const newActiveRangeFilters = { ...ctx.getState().activeRangeFilters };
    delete newActiveRangeFilters[action.key];

    ctx.patchState({
      activeRangeFilters: newActiveRangeFilters,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(OverwriteActiveRangeFilters)
  overwriteActiveRangeFilters(
    ctx: StateContext<SearchStateModel>,
    action: OverwriteActiveRangeFilters
  ) {
    ctx.patchState({
      activeRangeFilters: action.activeRangeFilters,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(OverwriteActiveAggregationBuckets)
  overwriteActiveAggregationBuckets(
    ctx: StateContext<SearchStateModel>,
    action: OverwriteActiveAggregationBuckets
  ) {
    ctx.patchState({
      activeAggregationBuckets: action.activeAggregationBuckets,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ChangeActiveAggregationBuckets)
  changeActiveAggregationBuckets(
    ctx: StateContext<SearchStateModel>,
    action: ChangeActiveAggregationBuckets
  ) {
    const key = action.aggregation.key;
    let activeAggregationBuckets = new Map<string, string[]>(
      ctx.getState().activeAggregationBuckets
    );
    const bucketKey = action.aggregationBucket.key;

    // Check if some active aggregation exists
    if (activeAggregationBuckets) {
      const activeAggregations = activeAggregationBuckets.get(
        action.aggregation.key
      );
      // Check if aggregations already exist for the current filter that was changed.
      if (activeAggregations) {
        // If the changed filter (bucket) is  in the list, it will be removed.
        if (activeAggregations.some((r) => r === bucketKey)) {
          const filteredActiveAggregations = activeAggregations.filter(
            (r) => r !== bucketKey
          );

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
      activeAggregationBuckets: activeAggregationBuckets,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ChangeActiveAggregationBucketList)
  changeActiveAggregationBucketList(
    ctx: StateContext<SearchStateModel>,
    action: ChangeActiveAggregationBucketList
  ) {
    const key = action.aggregation.key;
    let activeAggregationBuckets = new Map<string, string[]>(
      ctx.getState().activeAggregationBuckets
    );

    const activeAggregation = activeAggregationBuckets.get(
      action.aggregation.key
    );

    if (activeAggregation) {
      action.aggregationBuckets.length === 0
        ? activeAggregationBuckets.delete(key)
        : activeAggregationBuckets.set(key, action.aggregationBuckets);
    } else {
      activeAggregationBuckets.set(key, action.aggregationBuckets);
    }

    ctx.patchState({
      page: 1,
      activeAggregationBuckets: activeAggregationBuckets,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ChangeSearchText)
  changeSearchText(
    ctx: StateContext<SearchStateModel>,
    action: ChangeSearchText
  ) {
    ctx.patchState({
      searchText: action.searchText,
      searchTimestamp: new Date(),
      page: 1,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(ChangePage)
  changePage(ctx: StateContext<SearchStateModel>, action: ChangePage) {
    ctx.patchState({
      page: action.page,
    });

    if (!action.initialChange) {
      return ctx.dispatch(new RefreshRoute());
    }
  }

  @Action(SearchByPidUri)
  fetchSearchResultByPidUri(
    { patchState }: StateContext<SearchStateModel>,
    action: SearchByPidUri
  ) {
    patchState({
      searchResult: null,
      searching: true,
      didYouMean: null,
    });

    return this.searchService.searchDocument(action.pidUri).pipe(
      tap((s) => {
        patchState({
          searchResult: s,
          aggregations: s.aggregations,
          correctedSearchText: s.suggestedSearchTerm,
          didYouMean: s.suggestedSearchTerm,
          errorCode: null,
          searching: false,
        });
      }),
      finalize(() => {
        patchState({ searching: false });
      })
    );
  }

  @Action(FetchSearchResult, { cancelUncompleted: true })
  fetchSearchResult(
    { patchState, dispatch }: StateContext<SearchStateModel>,
    action: FetchSearchResult
  ) {
    patchState({
      searchResult: null,
      searching: true,
      didYouMean: null,
    });

    const queryParams = action.route.snapshot.queryParams;
    const searchTerm: string = queryParams["q"];
    const page = queryParams["p"] == null ? 1 : queryParams["p"];
    const activeAggergationBuckets =
      queryParams["f"] == null
        ? queryParams["f"]
        : JSON.parse(queryParams["f"]);
    const activeRangeFilters =
      queryParams["r"] == null
        ? queryParams["r"]
        : JSON.parse(queryParams["r"]);

    return combineLatest([
      this.searchService.search(
        searchTerm,
        page,
        activeAggergationBuckets,
        activeRangeFilters
      ),
      this.searchService.getAllPidUrisOfSearchResult(
        searchTerm,
        activeAggergationBuckets,
        activeRangeFilters
      ),
    ]).pipe(
      tap(([searchResult, allPidUrisSearchResult]) => {
        let didYouMean = null;
        try {
          const firstSuggest = Object.values(searchResult.suggest)[0][0];
          if (
            firstSuggest &&
            firstSuggest.options &&
            firstSuggest.options.length
          ) {
            didYouMean = firstSuggest.options[0].text;
          }
        } catch (e) {
          console.log("Could not get dym", e);
        }
        const stateUpdates = {
          searchResult,
          aggregations: searchResult.aggregations,
          correctedSearchText: searchResult.suggestedSearchTerm,
          didYouMean: didYouMean,
          errorCode: null,
        };
        patchState(stateUpdates);
        this.store.dispatch(new FetchColidEntrySubscriptionNumbers());
        // this.store.dispatch(new FetchResourcePolicies(searchResult));
        this.store.dispatch(new ClearSelectedPIDURIs());
        patchState({
          searching: false,
          searchResultPidUris: allPidUrisSearchResult,
        });
      }),
      switchMap(([s]) => {
        return dispatch(new SetFilterItems(s.aggregations, s.rangeFilters));
      }),
      catchError((err) => {
        console.log(err);
        const dmpEx = err.error as DmpException;
        patchState({ errorCode: dmpEx.errorCode, searching: false });
        return of(err);
      })
    );
  }

  @Action(FetchNextSearchResult)
  fetchNextSearchResult(
    { getState, patchState }: StateContext<SearchStateModel>,
    action: FetchNextSearchResult
  ) {
    const state = getState();
    const newPage = state.page + 1;

    const queryParams = action.route.snapshot.queryParams;
    const searchTerm: string = queryParams["q"];
    const activeAggergationBuckets =
      queryParams["f"] == null
        ? queryParams["f"]
        : JSON.parse(queryParams["f"]);
    const activeRangeFilters =
      queryParams["r"] == null
        ? queryParams["r"]
        : JSON.parse(queryParams["r"]);

    return this.searchService
      .search(searchTerm, newPage, activeAggergationBuckets, activeRangeFilters)
      .pipe(
        tap((s) => {
          let didYouMean = null;
          try {
            const firstSuggest = Object.values(s.suggest)[0][0];
            if (
              firstSuggest &&
              firstSuggest.options &&
              firstSuggest.options.length
            ) {
              didYouMean = firstSuggest.options[0].text;
            }
          } catch (e) {}
          const oldResult = getState().searchResult;

          const mergedResult = [...oldResult.hits.hits, ...s.hits.hits];
          s.hits.hits = mergedResult;

          patchState({
            searchResult: { ...s },
            didYouMean: didYouMean,
            page: newPage,
          });
          this.store.dispatch(new FetchColidEntrySubscriptionNumbers());
          // this.store.dispatch(new FetchResourcePolicies(s));
        }),
        catchError((err) => {
          console.log(err);
          const dmpEx = err.error as DmpException;
          patchState({ errorCode: dmpEx.errorCode });
          return of(err);
        })
      );
  }

  @Action(FetchAutocompleteResults)
  fetchAutocompleteResults(
    { patchState }: StateContext<SearchStateModel>,
    { searchText }: FetchAutocompleteResults
  ) {
    if (searchText) {
      return this.searchService.fetchAutoCompleteResults(searchText).pipe(
        tap((result) => {
          patchState({
            autoCompleteResults: result,
          });
        }),
        takeUntil(
          this.actions$.pipe(
            ofActionDispatched(FetchAutocompleteResults, FetchSearchResult)
          )
        )
      );
    } else {
      patchState({
        autoCompleteResults: null,
      });
    }
  }

  @Action(FetchLinkedTableandColumnResults)
  fetchLinkedTableandColumnResults(
    { patchState }: StateContext<SearchStateModel>,
    requesturl
  ) {
    patchState({
      loading: true,
    });
    if (requesturl) {
      return this.searchService
        .fetchLinkedTableandColumnResourceById(requesturl.id)
        .pipe(
          tap((result) => {
            patchState({
              loading: false,
              linkedTableAndcolumnResource: result,
            });
          }),
          catchError((err) => {
            patchState({ errorSchema: err, loading: true });
            return of(err);
          })
          //takeUntil(this.actions$.pipe(ofActionDispatched(FetchAutocompleteResults, FetchSearchResult)))
        );
    } else {
      patchState({
        loading: false,
        linkedTableAndcolumnResource: null,
      });
    }
  }

  @Action(FetchSchemaUIResults)
  fetchSchemaUIResults(
    { patchState }: StateContext<SearchStateModel>,
    requesturls
  ) {
    patchState({
      loading: true,
    });
    if (requesturls.displayTableAndColumn) {
      return this.searchService
        .fetchSchemaUIItems(requesturls.displayTableAndColumn)
        .pipe(
          tap((result) => {
            patchState({
              loading: false,
              schemaUIDetail: result,
            });
          }),
          catchError((err) => {
            patchState({ errorSchema: err, loading: true });
            return of(err);
          })
          //takeUntil(this.actions$.pipe(ofActionDispatched(FetchAutocompleteResults, FetchSearchResult)))
        );
    } else {
      patchState({
        loading: false,
        schemaUIDetail: null,
      });
    }
  }

  @Action(AddSelectedPIDURI)
  AddSelectedPIDURI(
    ctx: StateContext<SearchStateModel>,
    action: AddSelectedPIDURI
  ) {
    const newSelectedPIDURIs: string[] = [...ctx.getState().selectedPIDURIs];
    newSelectedPIDURIs.push(action.selectedPIDURI);
    ctx.patchState({
      selectedPIDURIs: newSelectedPIDURIs,
    });
  }

  @Action(AddSelectedPIDURIs)
  AddSelectedPIDURIs(
    { patchState }: StateContext<SearchStateModel>,
    action: AddSelectedPIDURIs
  ) {
    patchState({
      selectedPIDURIs: action.selectedPIDURIs,
    });
  }

  @Action(RemoveSelectedPIDURI)
  RemoveSelectedPIDURI(
    ctx: StateContext<SearchStateModel>,
    action: RemoveSelectedPIDURI
  ) {
    const newSelectedPIDURIs = ctx
      .getState()
      .selectedPIDURIs.filter((pidURI) => pidURI !== action.selectedPIDURI);
    ctx.patchState({
      selectedPIDURIs: newSelectedPIDURIs,
    });
  }

  @Action(ClearSelectedPIDURIs)
  ClearSelectedPIDURIs({ patchState }: StateContext<SearchStateModel>) {
    patchState({
      selectedPIDURIs: [],
    });
  }
}
