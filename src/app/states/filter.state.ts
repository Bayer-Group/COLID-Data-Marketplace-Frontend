import { State, Action, StateContext, Selector } from "@ngxs/store";
import { Aggregation } from "../shared/models/aggregation";
import { SearchService } from "../core/http/search.service";
import { MetadataService } from "../core/http/metadata.service";
import { RangeFilter } from "../shared/models/range-filter";
import { Injectable } from "@angular/core";
import { FilterGroupingOrderRaw } from "../shared/models/metadata/filter-grouping-order-raw";
import { forkJoin } from "rxjs";

export class FetchFilter {
  static readonly type = "[Filter] FetchFilterItems";
}

export class SetFilterItems {
  static readonly type = "[Filter] SetFilterItems";
  constructor(
    public aggregations: Aggregation[],
    public rangeFilters: RangeFilter[]
  ) {}
}

export class SetFilterGroupPanelState {
  static readonly type = "[Filter] SetFilterGroupPanelState";
  constructor(public groupName: string, public opened: boolean) {}
}

export class SetTypeItems {
  static readonly type = "[Filter] SetTypeItems";
  constructor(public typeItemIds: string[]) {}
}

export interface FilterStateModel {
  loading: boolean;
  aggregationFilters: Aggregation[];
  rangeFilters: RangeFilter[];
  filterOrder: FilterGroupingOrderRaw[];
}

@State<FilterStateModel>({
  name: "filter",
  defaults: {
    loading: false,
    aggregationFilters: null,
    rangeFilters: null,
    filterOrder: null,
  },
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

  @Selector()
  public static getFilterOrder(state: FilterStateModel) {
    return state.filterOrder;
  }

  @Selector()
  public static loading(state: FilterStateModel) {
    return state.loading;
  }
  constructor(
    private searchService: SearchService,
    private metadataService: MetadataService
  ) {}

  ngxsOnInit(ctx: StateContext<FilterStateModel>) {
    const state = ctx.getState();
    ctx.patchState(state);
  }

  @Action(FetchFilter)
  fetchResource({ patchState }: StateContext<FilterStateModel>) {
    patchState({
      loading: true,
    });
    forkJoin({
      filterGroupsRaw: this.metadataService.getFilterGroups(),
      filters: this.searchService.getFilterItems(),
    }).subscribe(({ filterGroupsRaw, filters }) => {
      const filterGroups = filterGroupsRaw.map((filterGroupRaw) => {
        const singleFilterGroup: FilterGroupingOrderRaw = {
          ...filterGroupRaw,
          expanded: filterGroupRaw.groupName === "Primary",
        };
        return singleFilterGroup;
      });
      patchState({
        loading: false,
        aggregationFilters: filters.aggregations,
        rangeFilters: filters.rangeFilters,
        filterOrder: filterGroups,
      });
    });
  }

  @Action(SetFilterItems)
  setFilter(
    { patchState, getState }: StateContext<FilterStateModel>,
    { aggregations, rangeFilters }: SetFilterItems
  ) {
    const filterOrder = getState().filterOrder;
    if (filterOrder == null) {
      this.metadataService.getFilterGroups().subscribe((filterGroupsRaw) => {
        const filterGroups = filterGroupsRaw.map((filterGroupRaw) => {
          const singleFilterGroup: FilterGroupingOrderRaw = {
            ...filterGroupRaw,
            expanded: filterGroupRaw.groupName === "Primary",
          };
          return singleFilterGroup;
        });
        patchState({
          loading: false,
          aggregationFilters: aggregations,
          rangeFilters: rangeFilters,
          filterOrder: filterGroups,
        });
      });
    } else {
      patchState({
        loading: false,
        aggregationFilters: aggregations,
        rangeFilters: rangeFilters,
      });
    }
  }

  @Action(SetFilterGroupPanelState)
  setFilterGroupPanelState(
    { patchState, getState }: StateContext<FilterStateModel>,
    { groupName, opened }: SetFilterGroupPanelState
  ) {
    const filterOrder = [...getState().filterOrder];
    const groupFilter = filterOrder.find(
      (filter) => filter.groupName === groupName
    );
    groupFilter.expanded = opened;
    patchState({
      filterOrder,
    });
  }
}
