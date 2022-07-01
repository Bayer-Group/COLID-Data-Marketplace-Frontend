import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserInfoState, RemoveSearchFilterDataMarketplace, RemoveStoredQueryToSearchFiltersDataMarketplace, FetchSearchFilterDataMarketplace } from 'src/app/states/user-info.state';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { Select, Store } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { FetchFilter, FilterState, SetFilterItems  } from 'src/app/states/filter.state';
import { Aggregation } from 'src/app/shared/models/aggregation';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { StoredQueryDto } from 'src/app/shared/models/user/stored-query-dto';
import { IntervalNotificationDiallogComponent } from '../../interval-notification-diallog/interval-notification-diallog.component';
import { RangeFilter } from 'src/app/shared/models/range-filter';
import { ChangePage, ChangeSearchText, OverwriteActiveAggregationBuckets, OverwriteActiveRangeFilters, RefreshRoute } from 'src/app/states/search.state';
import { jsonToStringMap } from 'src/app/shared/converters/string-map-object.converter';
import { mapToObject } from 'src/app/shared/converters/map-object.converter';

@Component({
  selector: 'app-search-filter-data-marketplace',
  templateUrl: './search-filter-data-marketplace.component.html',
  styleUrls: ['./search-filter-data-marketplace.component.scss']
})
export class SearchFilterDataMarketplaceComponent implements OnInit, OnDestroy {
  @Select(UserInfoState.getUserSearchFilters) userSearchFilters$: Observable<SearchFilterDataMarketplaceDto[]>;
  @Select(FilterState.getAggregationFilters) aggregationFilters$: Observable<Aggregation[]>;
  @Select(FilterState.loading) loading$: Observable<boolean>;
  @Select(FilterState.getRangeFilters) rangeFilters$: Observable<RangeFilter[]>;
  
  filterKey: string;
  filterKeyLabel: string;
  userSearchFiltersSubscription: Subscription;
  aggregationFiltersSubscription: Subscription;
  rangeFiltersSubscription: Subscription;
  userSearchFilters: SearchFilterDataMarketplaceDto[];
  aggregationFilters: Aggregation[];
  rangeFilters: RangeFilter[];
  selectedSubscriptionValue: any;
  loading:boolean = false;
  constructor(private store: Store, private snackbar: ColidMatSnackBarService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadUserSearchFilters();
    this.loading$.subscribe(loading => {
      this.loading = loading;
    });
    
    this.aggregationFiltersSubscription = this.aggregationFilters$.subscribe(aggregationFilters => {
      this.aggregationFilters = aggregationFilters;
      this.store.dispatch(new FetchSearchFilterDataMarketplace()).subscribe(); 
    });

    this.rangeFiltersSubscription = this.rangeFilters$.subscribe(rangeFilters => {
      this.rangeFilters = rangeFilters;
    });

  }
  ngOnDestroy() {
    this.userSearchFiltersSubscription.unsubscribe();
  }
  loadUserSearchFilters() {
      this.userSearchFiltersSubscription = this.userSearchFilters$.subscribe(userSearchFilters => {
      this.userSearchFilters = userSearchFilters;
    });
    this.store.dispatch(new FetchFilter()).subscribe();
   
  };

  removeSearchFilters(removeFilter: SearchFilterDataMarketplaceDto) {
    this.store.dispatch(new RemoveSearchFilterDataMarketplace(removeFilter)).subscribe(() => {
      this.store.dispatch(new FetchSearchFilterDataMarketplace()).subscribe();
      this.snackbar.success('Saved Search Deleted', 'The saved search has been deleted successfully.');
    });
  };
  getKeyByValue(object, value) { 
    return Object.keys(object).find(key =>  
            object[key] === value); 
  }; 

  notificationSearchFilters(removeFilter: SearchFilterDataMarketplaceDto) {
    this.store.dispatch(new RemoveSearchFilterDataMarketplace(removeFilter)).subscribe(() => {
      this.store.dispatch(new FetchSearchFilterDataMarketplace()).subscribe()
      this.snackbar.success('Saved Search Deleted', 'The saved search has been deleted successfully.');
    });
  };

  onOpenIntervalNotificationDiallog(storedQuery: any) {
    this.dialog.open(IntervalNotificationDiallogComponent, {
      data:storedQuery
    });

    this.dialog.afterAllClosed.subscribe(x=>{
      this.store.dispatch(new FetchSearchFilterDataMarketplace()).subscribe(x=>{
      });
      this.userSearchFiltersSubscription = this.userSearchFilters$.subscribe(userSearchFilters => {
        this.userSearchFilters = userSearchFilters;
      });
    })
  }

  onUnsubscribeIntervalNotification(userSearchFilter: any)
  {
      this.store.dispatch(new RemoveStoredQueryToSearchFiltersDataMarketplace(userSearchFilter.id)).subscribe(()=>{
      this.snackbar.success('Removed Subscription', 'The selected search has been unsubscribed successfully.');
  });

  }

  getAggregationLabel(filterKey: string){
    this.filterKey == null;
    try {
      this.filterKeyLabel = this.getKeyByValue(Constants.Metadata, filterKey); 
      this.filterKeyLabel = !this.filterKeyLabel ? this.aggregationFilters.filter(element=>element.key===filterKey)[0].label : this.filterKeyLabel;
      return this.filterKeyLabel;
   }
   catch(e) {
    return this.filterKey;
   }
  }

  getStateInitializationActionsFromQueryParams(userSearchFilter:any): any {
    const page = "";
    const query = userSearchFilter.searchTerm || "*";
    const filter = new Map<string,string[]>(Object.entries(userSearchFilter.filterJson.aggregations));//""//params['f'];
    const rangeFilter =userSearchFilter.filterJson.ranges

    const initActions = [];

    if (page) {
      initActions.push(new ChangePage(page, true));
    }
    if (query) {
      initActions.push(new ChangeSearchText(query, true));
    }
    if (filter) {
      initActions.push(new OverwriteActiveAggregationBuckets(filter, true));
    }
    if (rangeFilter) {
      try {
        const parsedRangeFilter = JSON.parse(rangeFilter);
        initActions.push(new OverwriteActiveRangeFilters(rangeFilter, true));
      } catch (error) {
      }
    }
    this.store.dispatch([ ...initActions, new RefreshRoute()]).subscribe();
  }
}
