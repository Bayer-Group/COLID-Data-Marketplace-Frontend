import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import {
  FetchFilter,
  FilterState,
  SetFilterGroupPanelState,
} from "src/app/states/filter.state";
import { Observable, Subscription, combineLatest } from "rxjs";
import { Select, Store } from "@ngxs/store";
import { Aggregation } from "src/app/shared/models/aggregation";
import {
  ResetActiveAggregationBuckets,
  SearchState,
  SearchStateModel,
  OverwriteActiveAggregationBuckets,
  OverwriteActiveRangeFilters,
} from "../../../states/search.state";
import { RangeFilter } from "src/app/shared/models/range-filter";
import { ActiveRangeFilters } from "src/app/shared/models/active-range-filters";
import { Constants } from "src/app/shared/constants";
import { UserInfoState } from "src/app/states/user-info.state";
import { SearchFilterDataMarketplaceDto } from "src/app/shared/models/user/search-filter-data-marketplace-dto";
import { objectToMap } from "src/app/shared/converters/map-object.converter";
import { mapToObject } from "src/app/shared/converters/map-object.converter";
import { MatDialog } from "@angular/material/dialog";
import { LogService } from "src/app/core/logging/log.service";
import { SearchFilterDialogComponent } from "src/app/components/sidebar/search-filter-dialog/search-filter-dialog.component";
import {
  ClearResourceTypeItem,
  FetchResourceTypeHierarchy,
  MetadataState,
} from "src/app/states/metadata.state";
import { ActivatedRoute } from "@angular/router";
import { FilterGroupingOrder } from "src/app/shared/models/metadata/filter-grouping-order";
import { FilterGroupingOrderRaw } from "src/app/shared/models/metadata/filter-grouping-order-raw";

@Component({
  selector: "app-filter-panel",
  templateUrl: "./filter-panel.component.html",
  styleUrls: ["./filter-panel.component.scss"],
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  @Select(FilterState.getAggregationFilters) aggregationFilters$: Observable<
    Aggregation[]
  >;
  @Select(FilterState.getRangeFilters) rangeFilters$: Observable<RangeFilter[]>;
  @Select(FilterState.getFilterOrder) filterOrder$: Observable<
    FilterGroupingOrderRaw[]
  >;

  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<
    Map<string, string[]>
  >;
  @Select(SearchState.getActiveRangeFilters)
  activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(UserInfoState.getDefaultSearchFilterDataMarketplace)
  defaultSearchFilterDataMarketplace$: Observable<SearchFilterDataMarketplaceDto>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  masterSub: Subscription = new Subscription();
  aggregationFilterGroups: FilterGroupingOrder[];
  mainAggregationFilters: Aggregation[];

  mainAggregationFilterKeys: string[] = [Constants.Metadata.EntityType];

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  searchText: string;

  @Select(SearchState) searchState: Observable<SearchStateModel>;

  @Input() initialFilterPanel: boolean = false;

  constructor(
    private store: Store,
    private logger: LogService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchResourceTypeHierarchy());

    this.masterSub.add(
      this.aggregationFilters$.subscribe((aggregationFilters) => {
        const queryParams = this.route.snapshot.queryParams;
        if (
          aggregationFilters == null &&
          Object.keys(queryParams).length === 0
        ) {
          this.store.dispatch(new FetchFilter());
        } else {
          this.initializeFilters(aggregationFilters);
        }
      })
    );

    this.masterSub.add(
      this.activeAggregations$.subscribe((activeAggregations) => {
        this.activeAggregations = activeAggregations;
      })
    );
    this.masterSub.add(
      this.activeRangeFilters$.subscribe((activeRangeFilters) => {
        this.activeRangeFilters = activeRangeFilters;
      })
    );

    this.masterSub.add(
      combineLatest([
        this.aggregationFilters$,
        this.defaultSearchFilterDataMarketplace$,
      ]).subscribe(
        ([aggregationFilters, defaultSearchFilterDataMarketplace]: [
          Aggregation[],
          SearchFilterDataMarketplaceDto
        ]) => {
          if (
            aggregationFilters != null &&
            aggregationFilters.length > 0 &&
            this.initialFilterPanel == true &&
            defaultSearchFilterDataMarketplace != null
          ) {
            let defaultMainAggregationFilters =
              this.getReducedDefaultMainAggregationFilters(
                defaultSearchFilterDataMarketplace.filterJson.aggregations,
                aggregationFilters
              );

            const defaultAggregations = objectToMap<string, string[]>(
              defaultMainAggregationFilters
            );
            const defaultRangeFilters =
              defaultSearchFilterDataMarketplace.filterJson.ranges;
            this.store.dispatch(
              new OverwriteActiveAggregationBuckets(defaultAggregations, true)
            );
            this.store.dispatch(
              new OverwriteActiveRangeFilters(defaultRangeFilters, true)
            );
          }
        }
      )
    );
    this.masterSub.add(
      this.searchText$.subscribe((searchText) => (this.searchText = searchText))
    );
  }

  ngOnDestroy() {
    this.masterSub.unsubscribe();
  }

  private getReducedDefaultMainAggregationFilters(
    allDefaultAggregationFilters,
    allAggregations: Aggregation[]
  ) {
    return Object.keys(allDefaultAggregationFilters)
      .filter((key) =>
        allAggregations.some((aggFilter) => aggFilter.key === key)
      )
      .reduce((obj, key) => {
        obj[key] = allDefaultAggregationFilters[key];
        return obj;
      }, {});
  }

  initializeFilters(aggregationFilters: Aggregation[]) {
    if (aggregationFilters != null) {
      const filterGroupingOrder = this.store.selectSnapshot(
        FilterState.getFilterOrder
      );
      let aggregationFilterGroupsHelper = filterGroupingOrder.map((group) => {
        const filters = group.filters.map((filter) => {
          return {
            ...filter,
            aggregation: null,
          };
        });
        return {
          ...group,
          filters,
        };
      });
      aggregationFilters.forEach((aggregationFilter) => {
        aggregationFilterGroupsHelper.forEach((group) => {
          const filterGroupItemIndex = group.filters.findIndex(
            (groupFilter) => groupFilter.propertyUri === aggregationFilter.key
          );
          if (filterGroupItemIndex > -1) {
            group.filters[filterGroupItemIndex].aggregation = aggregationFilter;
          }
        });
      });
      aggregationFilterGroupsHelper.forEach((group) => {
        group.filters = group.filters.filter(
          (filter) =>
            filter.aggregation != null &&
            !this.mainAggregationFilterKeys.includes(filter.propertyUri)
        );
      });
      aggregationFilterGroupsHelper = aggregationFilterGroupsHelper.filter(
        (group) => group.filters.length > 0
      );

      this.aggregationFilterGroups = aggregationFilterGroupsHelper;

      this.mainAggregationFilters = aggregationFilters.filter((a) =>
        this.isMainAggFilter(a)
      );
    }
  }

  filterGroupTrackBy(index: number, filterGroup: FilterGroupingOrder) {
    return filterGroup.groupName;
  }

  isMainAggFilter(aggregation: Aggregation) {
    return this.mainAggregationFilterKeys.includes(aggregation.key);
  }

  openFilterGroupPanel(groupName: string) {
    this.store.dispatch(new SetFilterGroupPanelState(groupName, true));
  }

  closeFilterGroupPanel(groupName: string) {
    this.store.dispatch(new SetFilterGroupPanelState(groupName, false));
  }

  resetActiveAggregation() {
    const params = this.route.snapshot.queryParams;
    this.store.dispatch(new ClearResourceTypeItem());
    this.store.dispatch(
      new ResetActiveAggregationBuckets(Object.entries(params).length > 0)
    );
  }

  addSearchFilterLinkClicked(event: Event): void {
    event.preventDefault();
    const activeAggregationFilters = mapToObject(this.activeAggregations);
    const activeRangeFilters = this.activeRangeFilters;
    const searchText = this.searchText;
    this.logger.info("DMP_SAVE_SEARCH_FILTER_LINK_CLICKED", {
      searchText: searchText,
      activeRangeFilters: activeRangeFilters,
      activeAggregationFilters: activeAggregationFilters,
    });
    this.dialog.open(SearchFilterDialogComponent, {
      data: {
        searchText: searchText,
        activeRangeFilters: activeRangeFilters,
        activeAggregationFilters: activeAggregationFilters,
      },
    });
  }
}
