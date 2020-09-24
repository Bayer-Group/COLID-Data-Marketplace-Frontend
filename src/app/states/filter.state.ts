import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Aggregation } from '../shared/models/aggregation';
import { SearchService } from '../core/http/search.service';
import { RangeFilter } from '../shared/models/range-filter';

export class FetchFilter {
  static readonly type = '[Filter] FetchFilterItems';
}

export class SetFilterItems {
  static readonly type = '[Filter] SetFilterItems';
  constructor(public aggregations: Aggregation[], public rangeFilters: RangeFilter[]) { }
}

export interface FilterStateModel {
  aggregationFilters: Aggregation[];
  rangeFilters: RangeFilter[];
}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    aggregationFilters: null,
    rangeFilters: null
  }
})
export class FilterState {

  @Selector()
  public static getAggregationFilters(state: FilterStateModel) {
    return state.aggregationFilters;
  }

  @Selector()
  public static getRangeFilters(state: FilterStateModel) {
    return state.rangeFilters;
  }

  constructor(private searchService: SearchService) { }

  ngxsOnInit(ctx: StateContext<FilterStateModel>) {
    console.log('FilterState initialized');

    const state = ctx.getState();
    ctx.patchState(
      state
    );
  }


  @Action(FetchFilter)
  fetchResource({ patchState }: StateContext<FilterStateModel>, { }: FetchFilter) {
    console.log("FilterState fetchResource");

    this.searchService.getFilterItems().subscribe(res => {
      patchState({
        aggregationFilters: res.aggregations,
        rangeFilters: res.rangeFilters
      });
    });
  }

  @Action(SetFilterItems)
  setFilter({ patchState }: StateContext<FilterStateModel>, { aggregations, rangeFilters }: SetFilterItems) {
    console.log("FilterState setFilter");

    patchState({
      aggregationFilters: aggregations,
      rangeFilters: rangeFilters
    });
  }

}
