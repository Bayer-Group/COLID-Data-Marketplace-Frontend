import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, EMPTY } from "rxjs";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { Select, Store } from "@ngxs/store";
import {
  ChangePage,
  ChangeSearchText,
  FetchSearchResult,
  OverwriteActiveAggregationBuckets,
  SearchState,
  RefreshRoute,
  OverwriteActiveRangeFilters,
  ResetActiveAggregationBuckets,
  ClearSelectedPIDURIs,
  ToggleClusterView,
  FetchClusterResults,
} from "src/app/states/search.state";
import { SidebarState, SetSidebarOpened } from "src/app/states/sidebar.state";
import { jsonToStringMap } from "src/app/shared/converters/string-map-object.converter";
import { ActiveRangeFilters } from "src/app/shared/models/active-range-filters";
import { SearchFilterDialogComponent } from "../sidebar/search-filter-dialog/search-filter-dialog.component";
import { LogService } from "src/app/core/logging/log.service";
import { MatDialog } from "@angular/material/dialog";
import { mapToObject } from "src/app/shared/converters/map-object.converter";
import { ExportDialogComponent } from "../export-dialog/export-dialog.component";
import { switchMap, take, tap } from "rxjs/operators";
import { SearchHit, SearchResult } from "src/app/shared/models/search-result";
import { ColidMatSnackBarService } from "src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service";
import { MultiselectWarningDialogComponent } from "../multiselect-warning-dialog/multiselect-warning-dialog.component";
import { AddFavoriteDialogComponent } from "../favorites/components/add-favorite-dialog/add-favorite-dialog.component";
import { environment } from "src/environments/environment";
import { ExportService } from "src/app/core/http/export.service";
import { ExportSettings } from "src/app/shared/models/export/export-settings";
import { CookieService } from "ngx-cookie";
import { ClearResourceTypeItem } from "src/app/states/metadata.state";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  @Select(SearchState.getShowResultsClustered)
  showResultsClustered$: Observable<boolean>;
  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<
    Map<string, string[]>
  >;
  @Select(SearchState.getActiveRangeFilters)
  activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;
  @Select(SearchState.getSearchResult) searchResult$: Observable<SearchResult>;
  @Select(SearchState.getAllPidUrisOfSearchResult)
  pidUrisSearchResult$: Observable<string[]>;
  @Select(SearchState.getSelectedPIDURIs) selectedPIDURIs$: Observable<
    string[]
  >;

  private masterSubscription: Subscription = new Subscription();
  searchCounter: number = 1;
  private _result: SearchHit;
  private pidUris: string[] = [];

  activeAggregationsSubscription: Subscription;
  activeRangeFiltersSubscription: Subscription;
  routeSubscription: Subscription;
  routerSubscription: Subscription;

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  searchText: string = "";
  searchResult: SearchResult;
  pidUrisSearchResult: string[];
  selectedClusterPidUris: string[] = [];
  exportLimit: number = 500;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private cookieService: CookieService,
    private logger: LogService,
    private dialog: MatDialog,
    private snackBar: ColidMatSnackBarService,
    private exportService: ExportService
  ) {}

  ngOnInit() {
    //this.aggregationFilters$.subscribe(aggregationFilters => this.initializeFilters(aggregationFilters));
    const initActions = this.getStateInitializationActionsFromQueryParams();
    this.store.dispatch([...initActions, new RefreshRoute()]);
    this.masterSubscription.add(
      this.activeAggregations$.subscribe(
        (activeAggregations) => (this.activeAggregations = activeAggregations)
      )
    );
    this.masterSubscription.add(
      this.activeRangeFilters$.subscribe((activeRangeFilters) => {
        this.activeRangeFilters = activeRangeFilters;
      })
    );
    this.masterSubscription.add(
      this.searchText$.subscribe((searchText) => (this.searchText = searchText))
    );
    this.routerSubscription = this.router.events.subscribe((r) => {
      if (r instanceof NavigationEnd) {
        const navigationActions =
          this.getStateInitializationActionsFromQueryParams();
        this.store.dispatch(navigationActions);
      }
    });

    this.routeSubscription = this.route.queryParams
      .pipe(
        switchMap((_) => {
          return this.store.dispatch(new FetchSearchResult(this.route));
        })
      )
      .subscribe();

    this.masterSubscription.add(
      this.searchResult$.subscribe((s) => {
        this.searchResult = s;
      })
    );
    this.masterSubscription.add(
      this.pidUrisSearchResult$.subscribe(
        (pidUris) => (this.pidUrisSearchResult = pidUris)
      )
    );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
    this.masterSubscription.unsubscribe();
    this.store.dispatch(new ResetActiveAggregationBuckets(false));
    this.store.dispatch(new ClearResourceTypeItem());
  }

  receiveMessage(event: any) {
    const message = event.data.message;
    if (message == "selectedPidURIs") {
      let uris: string[] = event.data.value;
      this.pidUris = [];
      uris.forEach((u) => {
        this.pidUris.push(decodeURIComponent(u));
      });
    }
  }

  openInRRM() {
    this.selectedPIDURIs$.pipe(take(1)).subscribe((pidUris) => {
      // take only the first 40 PID URIs as the cookie has a memory limit
      this.cookieService.putObject("selectedResources", pidUris.slice(0, 40), {
        domain: environment.cookieSharingSubDomain,
      });
      this.store.dispatch(new ClearSelectedPIDURIs());
      const url = `${environment.rrmUrl}?viewSelectedResources=true`;
      window.open(url, "_blank");
    });
  }

  openFavoritesDialog() {
    this.selectedPIDURIs$
      .pipe(
        take(1),
        tap((pidUris: string[]) => {
          if (pidUris.length <= this.exportLimit) {
            this.dialog.open(AddFavoriteDialogComponent, {
              height: "400px",
              width: "500px",
              data: {
                multiSelect: true,
              },
            });
          } else {
            this.dialog.open(MultiselectWarningDialogComponent, {
              width: "500px",
              data: {
                dialogTitle: "Favorites List Warning",
                dialogContent: `
                Selected elements can not be added to a favorite list because it contains more than 500 results.
                <br />
                Please refine your selection to less than 500 results.`,
              },
            });
            this.store.dispatch(new ClearSelectedPIDURIs());
          }
        })
      )
      .subscribe();
  }

  closeSidebar() {
    this.store.dispatch(new SetSidebarOpened(false));
  }

  getStateInitializationActionsFromQueryParams(): any {
    const params = this.route.snapshot.queryParams;
    const page = +params["p"];
    const query = params["q"] || "*";
    const filter = params["f"];
    const rangeFilter = params["r"];

    const initActions = [];

    if (page) {
      initActions.push(new ChangePage(page, true));
    }
    if (query) {
      initActions.push(new ChangeSearchText(query, true));
    }
    if (filter) {
      initActions.push(
        new OverwriteActiveAggregationBuckets(jsonToStringMap(filter), true)
      );
    }
    if (rangeFilter) {
      try {
        const parsedRangeFilter = JSON.parse(rangeFilter);
        initActions.push(
          new OverwriteActiveRangeFilters(parsedRangeFilter, true)
        );
      } catch (error) {}
    }

    return initActions;
  }

  handleSearchChange(searchText: string) {
    this.searchCounter++;
    this.store.dispatch(new ChangeSearchText(searchText, false));
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
    let values = Array.from(this.activeAggregations.values());
    const allUndefined = values.every((v) => v === undefined);
    return allUndefined;
  }
  checkNullActiveRangeFilters() {
    return (
      Object.keys(this.activeRangeFilters).length === 0 &&
      this.activeRangeFilters.constructor === Object
    );
  }

  setSelectedClusterPidUris(selectedClusterPidUris: string[]) {
    this.selectedClusterPidUris = selectedClusterPidUris;
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
      disableClose: true,
    });
  }

  startExportResults(): void {
    const showResultsClustered = this.store.selectSnapshot(
      SearchState.getShowResultsClustered
    );
    if (
      !showResultsClustered &&
      this.searchResult.hits.total <= this.exportLimit
    ) {
      const dialogRef = this.dialog.open(ExportDialogComponent, {
        width: "50vw",
      });
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((exportSettings: ExportSettings) => {
            if (exportSettings) {
              const payload = this.exportService.getExportResultsPayload(
                exportSettings,
                this.route
              );
              return this.exportService.startExcelExport(payload).pipe(
                tap((_) => {
                  this.snackBar.successCustomDuration(
                    "Export started",
                    "Your export has been started. It could take some minutes, until the download link will appear in your notifications",
                    null,
                    5000
                  );
                })
              );
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe();
    } else if (
      showResultsClustered &&
      this.selectedClusterPidUris.length > 0 &&
      this.selectedClusterPidUris.length < this.exportLimit
    ) {
      const dialogRef = this.dialog.open(ExportDialogComponent, {
        width: "50vw",
      });
      dialogRef
        .afterClosed()
        .pipe(
          switchMap((exportSettings: ExportSettings) => {
            if (exportSettings) {
              const payload =
                this.exportService.getExportSelectedResultsPayload(
                  exportSettings,
                  this.selectedClusterPidUris
                );
              return this.exportService.startExcelExport(payload).pipe(
                tap((_) => {
                  this.snackBar.successCustomDuration(
                    "Export started",
                    "Your export has been started. It could take some minutes, until the download link will appear in your notifications",
                    null,
                    5000
                  );
                })
              );
            } else {
              return EMPTY;
            }
          })
        )
        .subscribe();
    } else {
      this.dialog.open(MultiselectWarningDialogComponent, {
        width: "500px",
        data: {
          dialogTitle: "Export Warning!",
          dialogContent: `
            This list cannot be exported because it contains more than 500 results.
            <br />
            Please refine your search to return less than 500 results.`,
        },
      });
    }
  }

  startExportSelectedResults(): void {
    this.selectedPIDURIs$
      .pipe(
        take(1),
        switchMap((pidUris: string[]) => {
          if (pidUris.length <= this.exportLimit) {
            const dialogRef = this.dialog.open(ExportDialogComponent, {
              width: "50vw",
            });
            return dialogRef.afterClosed().pipe(
              switchMap((exportSettings: ExportSettings) => {
                if (exportSettings) {
                  const payload =
                    this.exportService.getExportSelectedResultsPayload(
                      exportSettings,
                      pidUris
                    );
                  return this.exportService.startExcelExport(payload).pipe(
                    tap((_) => {
                      this.snackBar.successCustomDuration(
                        "Export started",
                        "Your export has been started. It could take some minutes, until the download link will appear in your notifications",
                        null,
                        5000
                      );
                      this.store.dispatch(new ClearSelectedPIDURIs());
                    })
                  );
                }
                return EMPTY;
              })
            );
          } else {
            this.dialog.open(MultiselectWarningDialogComponent, {
              width: "500px",
              data: {
                dialogTitle: "Export Warning!",
                dialogContent: `
                This list cannot be exported because it contains more than 500 results.
                <br />
                Please refine your selection to less than 500 results.`,
              },
            });
            this.store.dispatch(new ClearSelectedPIDURIs());
            return EMPTY;
          }
        })
      )
      .subscribe();
  }

  showClusteredResults() {
    this.store.dispatch([
      new ToggleClusterView(true),
      new FetchClusterResults(this.searchText),
    ]);
  }
}
