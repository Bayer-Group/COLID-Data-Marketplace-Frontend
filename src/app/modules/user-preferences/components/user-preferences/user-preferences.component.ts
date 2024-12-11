import { Component } from '@angular/core';
import { SidebarState, SetSidebarOpened } from 'src/app/states/sidebar.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent {
  @Select(SidebarState.sidebarOpened) sidebarOpened$: Observable<any>;
  @Select(SidebarState.sidebarMode) sidebarMode$: Observable<any>;

  constructor(private store: Store) {}

  setSidebarOpened(event) {
    this.store.dispatch(new SetSidebarOpened(event)).subscribe();
  }
}
