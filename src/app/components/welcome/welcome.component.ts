import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  SearchState,
  ChangeSearchText,
  SetSearchIndex
} from 'src/app/states/search.state';
import {
  EMPTY,
  Observable,
  Subscription,
  combineLatest,
  switchMap,
  tap,
  timer
} from 'rxjs';
import { FetchFilter } from 'src/app/states/filter.state';
import { LogService } from 'src/app/core/logging/log.service';
import { SidebarState, SetSidebarOpened } from 'src/app/states/sidebar.state';
import {
  FetchWelcomeMessageDataMarketplace,
  WelcomeMessageState
} from 'src/app/states/welcome-message.state';
import { UserInfoState } from 'src/app/states/user-info.state';
import { MatDialog } from '@angular/material/dialog';
import { ChangelogDialogComponent } from './changelog-dialog/changelog-dialog.component';
import { WelcomeMessage } from 'src/app/shared/models/welcome-message';
import { UserDto } from 'src/app/shared/models/user/user-dto';
import { MatRadioChange } from '@angular/material/radio';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ReindexApiService } from 'src/app/core/http/reindex.api.service';
import { IndexingStatus } from 'src/app/shared/models/indexing-status-dto';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  masterSub: Subscription = new Subscription();

  @Select(SearchState.getAutoCompleteResults)
  autocompleteResultObservable$: Observable<string[]>;

  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;

  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;

  @Select(UserInfoState.getUser) user$: Observable<UserDto>;

  @Select(UserInfoState.getUserDepartment)
  userDepartment$: Observable<string>;

  @Select(WelcomeMessageState.getWelcomeMessageDataMarketplace)
  welcomeMessage$: Observable<WelcomeMessage>;

  userDepartment: string;
  reindexProgress$!: Observable<IndexingStatus>;
  searchText: string = '*';

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.authService.hasCreatePrivilege$;
  }

  get hasEditorFunctionalitiesPrivilege$(): Observable<boolean> {
    return this.authService.hasEditorFunctionalitiesPrivilege$;
  }

  constructor(
    private store: Store,
    private logger: LogService,
    private dialog: MatDialog,
    private authService: AuthService,
    private reindexService: ReindexApiService
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchFilter());
    this.store.dispatch(new SetSearchIndex('published'));
    this.store.dispatch(new FetchWelcomeMessageDataMarketplace());
    this.masterSub.add(
      this.userDepartment$.subscribe((dept) => {
        if (dept != null) {
          this.logger.info('DMP_WELCOME_PAGE_OPENED', {
            department: dept.split('-').slice(0, 5).join('-')
          });
        }
      })
    );
    this.masterSub.add(
      combineLatest([this.user$, this.welcomeMessage$])
        .pipe(
          tap(([user, welcomeMessage]) => {
            if (
              user != null &&
              welcomeMessage != null &&
              user.showUserInformationFlagDataMarketplace
            ) {
              this.openChangelogDialog(welcomeMessage);
            }
          })
        )
        .subscribe()
    );
    this.reindexProgress$ = this.authService.hasAdminPrivilege$.pipe(
      switchMap((isAdmin: boolean) => {
        if (isAdmin) {
          return timer(0, 60 * 1000).pipe(
            switchMap(() => {
              return this.reindexService.getIndexingStatus();
            })
          );
        }
        return EMPTY;
      }),
      tap((reindexResult) => console.log(reindexResult))
    );
  }

  openChangelogDialog(welcomeMessage) {
    this.dialog.open(ChangelogDialogComponent, {
      width: '60vw',
      data: {
        welcomeMessage
      },
      disableClose: true,
      autoFocus: false
    });
  }

  handleSearchChange(searchText: string) {
    this.store.dispatch(new ChangeSearchText(searchText, false)).subscribe();
  }

  handleInputChange(searchText: string) {
    this.searchText = searchText;
  }

  search() {
    this.handleSearchChange(this.searchText);
  }

  closeSidebar() {
    this.store.dispatch(new SetSidebarOpened(false)).subscribe();
  }

  setSearchIndex(ev: MatRadioChange) {
    this.store.dispatch([new SetSearchIndex(ev.value), new FetchFilter()]);
  }

  ngOnDestroy(): void {
    this.masterSub.unsubscribe();
  }
}
