import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
  UserInfoState,
  RemoveSearchFilterDataMarketplace,
  RemoveStoredQueryToSearchFiltersDataMarketplace,
  FetchSearchFilterDataMarketplace
} from 'src/app/states/user-info.state';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { Select, Store } from '@ngxs/store';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { Constants } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { IntervalNotificationDiallogComponent } from '../../interval-notification-diallog/interval-notification-diallog.component';
import {
  ChangePage,
  ChangeSearchText,
  OverwriteActiveAggregationBuckets,
  OverwriteActiveRangeFilters,
  RefreshRoute
} from 'src/app/states/search.state';
import { CreateBrowsableUriDialogComponent } from './create-browsable-uri-dialog/create-browsable-uri-dialog.component';

@Component({
  selector: 'app-search-filter-data-marketplace',
  templateUrl: './search-filter-data-marketplace.component.html',
  styleUrls: ['./search-filter-data-marketplace.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchFilterDataMarketplaceComponent implements OnInit, OnDestroy {
  @Select(UserInfoState.getUserSearchFilters) userSearchFilters$: Observable<
    SearchFilterDataMarketplaceDto[]
  >;

  filterKey: string;
  filterKeyLabel: string;
  userSearchFiltersSubscription: Subscription;
  userSearchFilters: SearchFilterDataMarketplaceDto[];
  selectedSubscriptionValue: any;

  constructor(
    private store: Store,
    private snackbar: ColidMatSnackBarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new FetchSearchFilterDataMarketplace());
    this.loadUserSearchFilters();
  }

  ngOnDestroy() {
    this.userSearchFiltersSubscription.unsubscribe();
  }

  loadUserSearchFilters() {
    this.userSearchFiltersSubscription = this.userSearchFilters$.subscribe(
      (userSearchFilters) => {
        this.userSearchFilters = userSearchFilters;
      }
    );
  }

  removeSearchFilters(
    event: MouseEvent,
    removeFilter: SearchFilterDataMarketplaceDto
  ) {
    event.stopPropagation();
    this.store
      .dispatch(new RemoveSearchFilterDataMarketplace(removeFilter))
      .subscribe(() => {
        this.store.dispatch(new FetchSearchFilterDataMarketplace());
        this.snackbar.success(
          'Saved Search Deleted',
          'The saved search has been deleted successfully.'
        );
      });
  }
  getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }

  notificationSearchFilters(removeFilter: SearchFilterDataMarketplaceDto) {
    this.store
      .dispatch(new RemoveSearchFilterDataMarketplace(removeFilter))
      .subscribe(() => {
        this.store.dispatch(new FetchSearchFilterDataMarketplace());
        this.snackbar.success(
          'Saved Search Deleted',
          'The saved search has been deleted successfully.'
        );
      });
  }

  onOpenIntervalNotificationDiallog(event: MouseEvent, storedQuery: any) {
    event.stopPropagation();
    this.dialog.open(IntervalNotificationDiallogComponent, {
      data: storedQuery
    });

    this.dialog.afterAllClosed.subscribe((_) => {
      this.store
        .dispatch(new FetchSearchFilterDataMarketplace())
        .subscribe((_) => {});
      this.userSearchFiltersSubscription = this.userSearchFilters$.subscribe(
        (userSearchFilters) => {
          this.userSearchFilters = userSearchFilters;
        }
      );
    });
  }

  onUnsubscribeIntervalNotification(event: MouseEvent, userSearchFilter: any) {
    event.stopPropagation();
    this.store
      .dispatch(
        new RemoveStoredQueryToSearchFiltersDataMarketplace(userSearchFilter.id)
      )
      .subscribe(() => {
        this.snackbar.success(
          'Removed Subscription',
          'The selected search has been unsubscribed successfully.'
        );
      });
  }

  createBrowsableUri(search: SearchFilterDataMarketplaceDto) {
    this.dialog.open(CreateBrowsableUriDialogComponent, {
      data: {
        search: search
      },
      disableClose: true
    });
  }

  getAggregationLabel(filterKey: string) {
    let filterKeyLabel =
      this.getKeyByValue(Constants.Metadata, filterKey) ?? '';
    return filterKeyLabel;
  }

  getStateInitializationActionsFromQueryParams(userSearchFilter: any): any {
    const page = '';
    const query = userSearchFilter.searchTerm || '*';
    const filter = new Map<string, string[]>(
      Object.entries(userSearchFilter.filterJson.aggregations)
    ); //""//params['f'];
    const rangeFilter = userSearchFilter.filterJson.ranges;

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
        initActions.push(new OverwriteActiveRangeFilters(rangeFilter, true));
      } catch (error) {
        console.log(error);
      }
    }
    this.store.dispatch([...initActions, new RefreshRoute()]).subscribe();
  }
}
