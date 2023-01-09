import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FetchFilter, FilterState } from 'src/app/states/filter.state';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { Aggregation } from 'src/app/shared/models/aggregation';
import { ResetActiveAggregationBuckets, SearchState, SearchStateModel, OverwriteActiveAggregationBuckets, OverwriteActiveRangeFilters } from '../../../states/search.state';
import { RangeFilter } from 'src/app/shared/models/range-filter';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { Constants } from 'src/app/shared/constants';
import { UserInfoState } from 'src/app/states/user-info.state';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { objectToMap } from 'src/app/shared/converters/map-object.converter';
import { mapToObject } from 'src/app/shared/converters/map-object.converter';
import { MatDialog } from '@angular/material/dialog';
import { LogService } from 'src/app/core/logging/log.service';
import { SearchFilterDialogComponent } from 'src/app/components/sidebar/search-filter-dialog/search-filter-dialog.component';
import { ClearResourceTypeItem, FetchResourceTypeHierarchy, MetadataState } from 'src/app/states/metadata.state';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit, OnDestroy {
  @Select(FilterState.getAggregationFilters) aggregationFilters$: Observable<Aggregation[]>;
  @Select(FilterState.getRangeFilters) rangeFilters$: Observable<RangeFilter[]>;

  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<Map<string, string[]>>;
  @Select(SearchState.getActiveRangeFilters) activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(UserInfoState.getDefaultSearchFilterDataMarketplace) defaultSearchFilterDataMarketplace$: Observable<SearchFilterDataMarketplaceDto>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;
  @Select(MetadataState.getMetadata) metadata$: Observable<any>;

  aggregationFilters: Aggregation[];
  mainAggregationFilters: Aggregation[];

  mainAggregationFilterKeys: string[] = [Constants.Metadata.EntityType];

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  searchText: string;

  combineLatestSubscription: Subscription;

  @Select(SearchState) searchState: Observable<SearchStateModel>;

  @Input() initialFilterPanel: boolean = false;

  constructor(private store: Store,
    private cdr: ChangeDetectorRef,
    private logger: LogService,
    private dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.dispatch(new FetchResourceTypeHierarchy()).subscribe();

    this.aggregationFilters$.subscribe(aggregationFilters => {
      if (aggregationFilters == null) {
        this.store.dispatch(new FetchFilter()).subscribe();
      } else {
        this.initializeFilters(aggregationFilters)
      }
    });

    this.activeAggregations$.subscribe(activeAggregations => {
      this.activeAggregations = activeAggregations
    });
    this.activeRangeFilters$.subscribe(activeRangeFilters => {
      this.activeRangeFilters = activeRangeFilters
    });

    this.combineLatestSubscription = combineLatest(
      this.aggregationFilters$,
      this.defaultSearchFilterDataMarketplace$,
    ).subscribe(([aggregationFilters, defaultSearchFilterDataMarketplace]: [Aggregation[], SearchFilterDataMarketplaceDto]) => {
      if (aggregationFilters != null && aggregationFilters.length > 0 && this.initialFilterPanel == true && defaultSearchFilterDataMarketplace != null) {
        let defaultMainAggregationFilters = this.getReducedDefaultMainAggregationFilters(defaultSearchFilterDataMarketplace.filterJson.aggregations, aggregationFilters);

        const defaultAggregations = objectToMap<string, string[]>(defaultMainAggregationFilters)
        const defaultRangeFilters = defaultSearchFilterDataMarketplace.filterJson.ranges;
        this.store.dispatch(new OverwriteActiveAggregationBuckets(defaultAggregations, true)).subscribe();
        this.store.dispatch(new OverwriteActiveRangeFilters(defaultRangeFilters, true)).subscribe();
      }
    });
    this.searchText$.subscribe(searchText => this.searchText = searchText);
  }

  ngOnDestroy() {
    this.combineLatestSubscription.unsubscribe();
  }

  private getReducedDefaultMainAggregationFilters(allDefaultAggregationFilters, allAggregations: Aggregation[]) {
    return Object.keys(allDefaultAggregationFilters)
      .filter(key => allAggregations.some(aggFilter => aggFilter.key === key))
      .reduce((obj, key) => {
        obj[key] = allDefaultAggregationFilters[key];
        return obj;
      }, {});
  }

  initializeFilters(aggregationFilters: Aggregation[]) {
    if (aggregationFilters != null) {
      const orderedAggFilters = aggregationFilters.slice().sort((a, b) => a.order - b.order).sort((a, b) => b.taxonomy ? -1 : 0);

      this.aggregationFilters = orderedAggFilters.filter(a => !this.isMainAggFilter(a));
      this.mainAggregationFilters = orderedAggFilters.filter(a => this.isMainAggFilter(a));
    }
    this.cdr.detectChanges()
  }

  isMainAggFilter(aggregation: Aggregation) {
    return this.mainAggregationFilterKeys.includes(aggregation.key);
  }

  resetActiveAggregation() {
    const params = this.route.snapshot.queryParams;
    this.store.dispatch(new ClearResourceTypeItem());
    this.store.dispatch(new ResetActiveAggregationBuckets(Object.entries(params).length > 0));
  }

  checkNullActiveAggregations() {
    let values = Array.from(this.activeAggregations.values())
    const allUndefined = values.every(v => v === undefined);
    return allUndefined;
  }
  checkNullActiveRangeFilters() {
    return Object.keys(this.activeRangeFilters).length === 0 && this.activeRangeFilters.constructor === Object;
  }

  addSearchFilterLinkClicked(event: Event): void {
    event.preventDefault();
    const activeAggregationFilters = mapToObject(this.activeAggregations);
    const activeRangeFilters = this.activeRangeFilters;
    const searchText = this.searchText;
    this.logger.info("DMP_SAVE_SEARCH_FILTER_LINK_CLICKED",
      {
        'searchText': searchText,
        'activeRangeFilters': activeRangeFilters,
        'activeAggregationFilters': activeAggregationFilters
      });
    this.dialog.open(SearchFilterDialogComponent, {
      data: {
        searchText: searchText,
        activeRangeFilters: activeRangeFilters,
        activeAggregationFilters: activeAggregationFilters
      }
    });
  }
}
