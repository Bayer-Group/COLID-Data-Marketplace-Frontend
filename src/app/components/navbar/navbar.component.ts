import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
import { SearchFilterDialogComponent } from '../sidebar/search-filter-dialog/search-filter-dialog.component';
import { LogService } from 'src/app/core/logging/log.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Select(StatusState.getBuildInformation) buildInformation$: Observable<StatusBuildInformationDto>;
  @Select(SearchState.getActiveAggregations) activeAggregations$: Observable<Map<string, string[]>>;
  @Select(SearchState.getActiveRangeFilters) activeRangeFilters$: Observable<ActiveRangeFilters>;
  @Select(NotificationState.getNotifications) notifications$: Observable<MessageDto[]>;
  @Select(SearchState.getSearchText) searchText$: Observable<string>;

  @Output() toggleNotification: EventEmitter<any> = new EventEmitter();

  environmentLabel = environment.Label;

  activeAggregations: Map<string, string[]>;
  activeRangeFilters: ActiveRangeFilters;
  newNotifications: number = 0;
  searchText: string;
  routeSubscription: Subscription;
  routerSubscription: Subscription;
  currentPage:string

  constructor(private route: ActivatedRoute,private router: Router,private authService: AuthService, private titleService: Title, private store: Store, private snackBar: ColidMatSnackBarService,private logger: LogService,
    private dialog: MatDialog) {
    this.titleService.setTitle('COLID Data Marketplace ' + this.environmentLabel)
  }

  ngOnInit() {
    this.notifications$.subscribe(n => { this.newNotifications = n != null ? n.filter(t => t.readOn == null).length : 0; })
    this.activeAggregations$.subscribe(activeAggregations => this.activeAggregations = activeAggregations);
    this.activeRangeFilters$.subscribe(activeRangeFilters => { this.activeRangeFilters = activeRangeFilters });
    this.searchText$.subscribe(searchText => this.searchText = searchText);
    this.routerSubscription = this.router.events.subscribe(r =>
      {
       if (r instanceof NavigationEnd){
          this.currentPage= r.url
        }
      });
  }

  get isLoggedIn$() : Observable<boolean> {
    return this.authService.isLoggedIn$;
  }

  get isLoadingUser() {
    return this.authService.isLoadingUser;
  }

  get currentName$() : Observable<string> {
    return this.authService.currentName$ || of('Unknown User');
  }

  goToEditor() {
    const url = environment.pidUrl;
    window.open(url, '_blank');
  }

  goToRRM() {
    const url = environment.rrmUrl;
    window.open(url, '_blank');
  }

  toggleNavbar() {
    this.store.dispatch(new ToggleSidebar()).subscribe();
  }

  saveActiveAggregationAsDefault() {
    const activeAggregationFilters = mapToObject(this.activeAggregations);
    const activeRangeFilters = this.activeRangeFilters;
    const searchText = this.searchText;

    const name = `default search filter at ${new Date().toISOString()}`;
    const newDefaultSearchFilters = new SearchFilterDataMarketplaceDto(name, searchText, new SearchFilterCollectionDto(activeAggregationFilters, activeRangeFilters));
    this.store.dispatch(new CreateDefaultSearchFilterDataMarketplace(newDefaultSearchFilters)).subscribe(() => {
      this.snackBar.success('Default filters', 'The selected filter settings have been set as default filters.');
    });
  }

  //It should be enable only search page
  checkSearchText(){
    if(this.checkCurrentPage()){
      if(this.searchText==""|| this.searchText=="*"){
          return true;
        }else{
          return false;
        }
    }
    return true;
  }
  checkNullActiveAggregations(){
   if(this.checkCurrentPage()){
      let values = Array.from( this.activeAggregations.values() )
      const allUndefined = values.every( v => v === undefined );
      return allUndefined;
    }
    return true;
  }

  checkCurrentPage(){
    if(this.currentPage && this.currentPage.startsWith("/search")){
      return true;
    }
    return false;
  }
  
  checkNullActiveRangeFilters(){
    if(this.checkCurrentPage()){
    return Object.keys(this.activeRangeFilters).length === 0 && this.activeRangeFilters.constructor === Object;
    }
    return true;
  }

  addSearchFilterLinkClicked(event: Event) : void {
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
      data: {searchText: searchText,
             activeRangeFilters: activeRangeFilters,
             activeAggregationFilters: activeAggregationFilters
      }
    });
  }
}
