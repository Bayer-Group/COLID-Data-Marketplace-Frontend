import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StatusState } from 'src/app/states/status.state';
import { ToggleSidebar } from 'src/app/states/sidebar.state';
import { Store, Select } from '@ngxs/store';
import { StatusBuildInformationDto } from 'src/app/shared/models/status/status-build-information-dto';
import { Observable, of, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { mapToObject } from 'src/app/shared/converters/map-object.converter';
import { SearchFilterDataMarketplaceDto } from 'src/app/shared/models/user/search-filter-data-marketplace-dto';
import { CreateDefaultSearchFilterDataMarketplace } from 'src/app/states/user-info.state';
import { SearchFilterCollectionDto } from 'src/app/shared/models/user/search-filter-collection-dto';
import { ActiveRangeFilters } from 'src/app/shared/models/active-range-filters';
import { ColidMatSnackBarService } from 'src/app/modules/colid-mat-snack-bar/colid-mat-snack-bar.service';
import { SearchState } from 'src/app/states/search.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { NotificationState } from 'src/app/modules/notification/notification.state';
import { MessageDto } from 'src/app/shared/models/user/message-dto';
import { Favorites } from 'src/app/shared/models/favorites';
import { FavoritesState } from '../favorites/favorites.state';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Select(StatusState.getBuildInformation) buildInformation$: Observable<StatusBuildInformationDto>;
  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<Map<string, string[]>>;
  @Select(SearchState.getActiveRangeFilters)
  activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(NotificationState.getNotifications) notifications$: Observable<MessageDto[]>;
  @Select(FavoritesState.getFavorites) favorites$: Observable<Favorites>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;

  @Output() toggleNotification: EventEmitter<any> = new EventEmitter();
  @Output() toggleFavorite: EventEmitter<any> = new EventEmitter();

  environmentLabel = environment.Label;

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  newNotifications: number = 0;
  newFavorites: Favorites;
  searchText: string;

  masterSub: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private titleService: Title,
    private store: Store,
    private snackBar: ColidMatSnackBarService,
  ) {
    this.titleService.setTitle(
      "COLID Data Marketplace " + this.environmentLabel
    );
  }

  ngOnInit() {
    this.masterSub.add(this.notifications$.subscribe((n) => {
      this.newNotifications =
        n != null ? n.filter((t) => t.readOn == null).length : 0;
    }));
    this.masterSub.add(this.favorites$.subscribe((newFavorites) => (this.newFavorites = newFavorites)));
    this.masterSub.add(this.activeAggregations$.subscribe(
      (activeAggregations) => (this.activeAggregations = activeAggregations)
    ));
    this.masterSub.add(this.activeRangeFilters$.subscribe((activeRangeFilters) => {
      this.activeRangeFilters = activeRangeFilters;
    }));
    this.masterSub.add(this.searchText$.subscribe((searchText) => (this.searchText = searchText)));
  }

  ngOnDestroy() {
    this.masterSub.unsubscribe();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get isLoadingUser() {
    return this.authService.isLoadingUser;
  }

  get currentName$(): Observable<string> {
    return this.authService.currentName$ || of("Unknown User");
  }

  get hasEditorFunctionalitiesPrivilege$(): Observable<boolean> {
    return this.authService.hasEditorFunctionalitiesPrivilege$;
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  goToEditor() {
    const url = environment.pidUrl;
    window.open(url, "_blank");
  }

  goToRRM() {
    const url = environment.rrmUrl;
    window.open(url, "_blank");
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar());
  }

  saveActiveAggregationAsDefault() {
    const activeAggregationFilters = mapToObject(this.activeAggregations);
    const activeRangeFilters = this.activeRangeFilters;
    const searchText = this.searchText;

    const name = `default search filter at ${new Date().toISOString()}`;
    const newDefaultSearchFilters = new SearchFilterDataMarketplaceDto(
      name,
      searchText,
      new SearchFilterCollectionDto(
        activeAggregationFilters,
        activeRangeFilters
      )
    );
    this.store.dispatch(new CreateDefaultSearchFilterDataMarketplace(newDefaultSearchFilters))
      .subscribe(() => {
        this.snackBar.success(
          "Default filters",
          "The selected filter settings have been set as default filters."
        );
      });
  }

}
