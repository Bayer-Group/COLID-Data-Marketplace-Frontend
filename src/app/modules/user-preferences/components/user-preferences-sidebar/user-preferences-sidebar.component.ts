import { Component, OnInit } from '@angular/core';
import { ClickedSidebarLink } from 'src/app/states/sidebar.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-user-preferences-sidebar',
  templateUrl: './user-preferences-sidebar.component.html',
  styleUrls: ['./user-preferences-sidebar.component.scss']
})
export class UserPreferencesSidebarComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit() {}

  linkClicked() {
    this.store.dispatch(new ClickedSidebarLink()).subscribe();
  }
}
