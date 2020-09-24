import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FilterState } from 'src/app/states/filter.state';
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

  aggregationFilters: Aggregation[];
  mainAggregationFilters: Aggregation[];

  mainAggregationFilterKeys: string[] = [Constants.Metadata.EntityType];

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;

  combineLatestSubscription: Subscription;

  @Select(SearchState) searchState: Observable<SearchStateModel>;

  loading: boolean;

  @Input() initialFilterPanel: boolean = false;

  constructor(private store: Store) { }

  ngOnInit() {
    this.aggregationFilters$.subscribe(aggregationFilters => this.initializeFilters(aggregationFilters));
    this.activeAggregations$.subscribe(activeAggregations => this.activeAggregations = activeAggregations);
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
  }

  isMainAggFilter(aggregation: Aggregation) {
    return this.mainAggregationFilterKeys.includes(aggregation.key);
  }

  resetActiveAggregation() {
    this.store.dispatch(new ResetActiveAggregationBuckets(true)).subscribe();
  }
}
