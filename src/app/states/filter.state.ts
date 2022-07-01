import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Aggregation } from '../shared/models/aggregation';
import { SearchService } from '../core/http/search.service';
import { RangeFilter } from '../shared/models/range-filter';
import { Injectable } from '@angular/core';

export class FetchFilter {
  static readonly type = '[Filter] FetchFilterItems';
}

export class SetFilterItems {
  static readonly type = '[Filter] SetFilterItems';
  constructor(public aggregations: Aggregation[], public rangeFilters: RangeFilter[]) { }
}

export class SetTypeItems {
  static readonly type = '[Filter] SetTypeItems';
  constructor(public typeItemIds: string[]) { }
}
export interface FilterStateModel {
  loading: boolean;
  aggregationFilters: Aggregation[];
  rangeFilters: RangeFilter[];
  checkboxIds: string[];
}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    loading: false,
    aggregationFilters: null,
    rangeFilters: null,
    // Hardcoded data for testing and development, remove before pushing
    checkboxIds: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  public static getAggregationFilters(state: FilterStateModel) {
    return state.aggregationFilters;
  }

  @Selector()
  public static getRangeFilters(state: FilterStateModel) {
    return state.rangeFilters;
  }

  // Getter function for selected checkbox id's
  @Selector()
  public static getcheckboxIds(state: FilterStateModel) {
    return state.checkboxIds;
  }


  @Selector()
  public static loading(state: FilterStateModel) {
    return state.loading;
  }
  constructor(private searchService: SearchService) { }

  ngxsOnInit(ctx: StateContext<FilterStateModel>) {
    const state = ctx.getState();
    ctx.patchState(
      state
    );
  }

  @Action(FetchFilter)
  fetchResource({ patchState }: StateContext<FilterStateModel>, { }: FetchFilter) {
    patchState({
      loading: true,
    })
    this.searchService.getFilterItems().subscribe(res => {
      patchState({
        loading: false,
        aggregationFilters: res.aggregations,
        rangeFilters: res.rangeFilters
      });
    });
  }


  @Action(SetTypeItems)
  SetTypeItems({patchState }: StateContext<FilterStateModel>, { typeItemIds }: SetTypeItems) {
    
    patchState({
      checkboxIds:typeItemIds
    });
  }

}
