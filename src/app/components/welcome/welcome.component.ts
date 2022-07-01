import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { SearchState, ChangeSearchText } from 'src/app/states/search.state';
import { Observable } from 'rxjs';
import { FetchFilter } from 'src/app/states/filter.state';
import { LogService } from 'src/app/core/logging/log.service';
import { SidebarState, SetSidebarOpened } from 'src/app/states/sidebar.state';
import { FetchWelcomeMessage } from 'src/app/states/welcome-message.state';
import { ActivatedRoute } from '@angular/router';
import { SetFromRRM, SetSourceDialog } from 'src/app/states/rrm.state';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  @Select(SearchState.getAutoCompleteResults) autocompleteResultObservable$: Observable<string[]>;
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;

  constructor(private store: Store, private route: ActivatedRoute, private logger: LogService) { 
    var state = JSON.parse(this.route.snapshot.queryParamMap.get('fromRRM'));
    this.store.dispatch(new SetFromRRM(state));

    var sourceDialog = this.route.snapshot.queryParamMap.get('sourceDialog');
    this.store.dispatch(new SetSourceDialog(sourceDialog));
  }

  ngOnInit() {
    this.store.dispatch(new FetchFilter()).subscribe();
    this.store.dispatch(new FetchWelcomeMessage()).subscribe();
   
    this.logger.info("DMP_WELCOME_PAGE_OPENED");
  }

  handleSearchChange(searchText: string) {
    this.store.dispatch(new ChangeSearchText(searchText, false)).subscribe();
  }

  closeSidebar() {
    this.store.dispatch(new SetSidebarOpened(false)).subscribe();
  }
}
