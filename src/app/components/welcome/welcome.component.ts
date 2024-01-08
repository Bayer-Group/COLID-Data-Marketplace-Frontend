import { Component, OnInit } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { SearchState, ChangeSearchText } from "src/app/states/search.state";
import { Observable } from "rxjs";
import { FetchFilter } from "src/app/states/filter.state";
import { LogService } from "src/app/core/logging/log.service";
import { SidebarState, SetSidebarOpened } from "src/app/states/sidebar.state";
import { FetchWelcomeMessageDataMarketplace } from "src/app/states/welcome-message.state";
import { ActivatedRoute } from "@angular/router";
import { UserInfoState } from "src/app/states/user-info.state";

@Component({
  selector: "app-welcome",
  templateUrl: "./welcome.component.html",
  styleUrls: ["./welcome.component.scss"],
})
export class WelcomeComponent implements OnInit {
  @Select(SearchState.getAutoCompleteResults)
  autocompleteResultObservable$: Observable<string[]>;
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;
  @Select(UserInfoState.getUserDepartment)
  userDepartment$: Observable<string>;
  userDepartment: string;
  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private logger: LogService
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchFilter());
    this.store.dispatch(new FetchWelcomeMessageDataMarketplace());
    this.userDepartment$.subscribe((dept) => {
      if (dept != null) {
        this.logger.info("DMP_WELCOME_PAGE_OPENED", {
          department: dept.split("-").slice(0, 5).join("-"),
        });
      }
    });
  }

  handleSearchChange(searchText: string) {
    this.store.dispatch(new ChangeSearchText(searchText, false)).subscribe();
  }

  closeSidebar() {
    this.store.dispatch(new SetSidebarOpened(false)).subscribe();
  }
}
