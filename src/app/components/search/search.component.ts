import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, Params } from '@angular/router';
import { Select, Store, Actions, ofActionDispatched, ofActionCompleted } from '@ngxs/store';
import {
  ChangePage,
  ChangeSearchText,
  FetchSearchResult, OverwriteActiveAggregationBuckets,
  SearchState,
  RefreshRoute,
  OverwriteActiveRangeFilters,
  ResetActiveAggregationBuckets
} from 'src/app/states/search.state';
import { SidebarState, SetSidebarOpened } from 'src/app/states/sidebar.state';
import { jsonToStringMap } from 'src/app/shared/converters/string-map-object.converter';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { SearchFilterDialogComponent } from '../sidebar/search-filter-dialog/search-filter-dialog.component';
import { LogService } from 'src/app/core/logging/log.service';
import { MatDialog } from '@angular/material/dialog';
import { mapToObject } from 'src/app/shared/converters/map-object.converter';
import { ExportDialogComponent } from '../export-dialog/export-dialog.component';
import { tap } from 'rxjs/operators';
import { RRMState } from 'src/app/states/rrm.state';
import { SearchResult } from "src/app/shared/models/search-result";
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { ExportWarningDialogComponent } from '../export-warning-dialog/export-warning-dialog.component';
import { SetFromRRM, SetSourceDialog } from 'src/app/states/rrm.state';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<Map<string, string[]>>;
  @Select(SearchState.getActiveRangeFilters) activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;
  @Select(SearchState.getSearchResult) searchResult$: Observable<SearchResult>;

  searchCounter: number = 1;

  @Select(RRMState.getFromRRM) buttons$: Observable<boolean>;
  button: boolean = false;

  activeAggregationsSubscription: Subscription;
  activeRangeFiltersSubscription: Subscription;
  routeSubscription: Subscription;
  routerSubscription: Subscription;

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  searchText: string;
  searchResult: SearchResult;
  exportLimit: number = 500;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private actions$: Actions, private logger: LogService,
    private dialog: MatDialog, private snackBar: ColidMatSnackBarService) {
    var state = JSON.parse(this.route.snapshot.queryParamMap.get('fromRRM'));
    this.store.dispatch(new SetFromRRM(state));

    var sourceDialog = this.route.snapshot.queryParamMap.get('sourceDialog');
    this.store.dispatch(new SetSourceDialog(sourceDialog));
    
    this.buttons$.pipe(
      tap(
        s => {
          this.button = s;
        }
      )
    ).subscribe();
  }

  ngOnInit() {
    const initActions = this.getStateInitializationActionsFromQueryParams();

    this.store.dispatch([...initActions, new RefreshRoute()]).subscribe();
    //this.aggregationFilters$.subscribe(aggregationFilters => this.initializeFilters(aggregationFilters));
    this.activeAggregations$.subscribe(activeAggregations => this.activeAggregations = activeAggregations);
    this.activeRangeFilters$.subscribe(activeRangeFilters => {
      this.activeRangeFilters = activeRangeFilters
    });
    this.searchText$.subscribe(searchText => this.searchText = searchText);
    this.routerSubscription = this.router.events.subscribe(r => {
      if (r instanceof NavigationEnd) {
        const navigationActions = this.getStateInitializationActionsFromQueryParams();
        this.store.dispatch(navigationActions).subscribe()
      }
    });

    this.routeSubscription = this.route.queryParams.subscribe((val) => {
      this.store.dispatch(new FetchSearchResult(this.route));
    });

    this.searchResult$.subscribe(s => {
      this.searchResult = s;
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.store.dispatch(new ResetActiveAggregationBuckets(false))
  }

  closeSidebar() {
    this.store.dispatch(new SetSidebarOpened(false)).subscribe();
  }

  getStateInitializationActionsFromQueryParams(): any {
    const params = this.route.snapshot.queryParams;
    const page = +params['p'];
    const query = params['q'] || '*';
    const filter = params['f'];
    const rangeFilter = params['r'];

    const initActions = [];

    if (page) {
      initActions.push(new ChangePage(page, true));
    }
    if (query) {
      initActions.push(new ChangeSearchText(query, true));
    }
    if (filter) {
      initActions.push(new OverwriteActiveAggregationBuckets(jsonToStringMap(filter), true));
    }
    if (rangeFilter) {
      try {
        const parsedRangeFilter = JSON.parse(rangeFilter);
        initActions.push(new OverwriteActiveRangeFilters(parsedRangeFilter, true));
      } catch (error) {
      }
    }

    return initActions;
  }

  handleSearchChange(searchText: string) {
    this.searchCounter++;
    this.store.dispatch(new ChangeSearchText(searchText, false));
  }

  handleInputChange(searchText: string) {
  }

  pageChanged(page: any) {
    this.searchCounter++;
    this.store.dispatch(new ChangePage(page, false));
  }

  //Saved search subscription function

  checkSearchText() {
    if (this.searchText == "" || this.searchText == "*") {
      return true;
    } else {
      return false;
    }
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

  startExport(): void {
    if (this.searchResult.hits.total <= this.exportLimit) {
      const dialogRef = this.dialog.open(ExportDialogComponent, {
        width: "600px",
        height: "500px",
      });

      dialogRef.afterClosed().subscribe((result) => {
      });
    } else {
      this.dialog.open(ExportWarningDialogComponent, {
        width: "500px",
        height: "225px",
      });
    }
  }

}
