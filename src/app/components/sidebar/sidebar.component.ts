import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  // TODO: remove this component and go to app-filter-panel directly

  @Input() initialFilterPanel: boolean = false;

  constructor(private store: Store) {}
}
