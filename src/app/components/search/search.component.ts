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

  searchCounter: number = 1;

  activeAggregationsSubscription: Subscription;
  activeRangeFiltersSubscription: Subscription;
  routeSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store, private actions$: Actions) {
  }

  ngOnInit() {
    console.log("app-search ngOnInit");

    const initActions = this.getStateInitializationActionsFromQueryParams();

    this.store.dispatch([ ...initActions, new RefreshRoute()]).subscribe();

    this.routerSubscription = this.router.events.subscribe(r =>
      {
        if (r instanceof NavigationEnd){
          const navigationActions = this.getStateInitializationActionsFromQueryParams();
          this.store.dispatch(navigationActions).subscribe()
        }
      });

    this.routeSubscription = this.route.queryParams.subscribe((val) => {
      this.store.dispatch(new FetchSearchResult(this.route));
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

    console.log("app-search getStateInitializationActionsFromQueryParams");

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
        console.log("Invalid range filter query string:", rangeFilter);
      }
    }

    return initActions;
  }

  handleSearchChange(searchText: string) {
    console.log("app-search handleSearchChange");

    console.log("app-search handleSearchChange", this.searchCounter);
    this.searchCounter++;
    this.store.dispatch(new ChangeSearchText(searchText, false));
  }

  handleInputChange(searchText: string) {
    console.log("app-search handleInputChange");
  }

  pageChanged(page: any) {
    console.log("app-search pageChanged");

    console.log("app-search pageChanged", this.searchCounter);

    this.searchCounter++;
    this.store.dispatch(new ChangePage(page, false));
  }
}
