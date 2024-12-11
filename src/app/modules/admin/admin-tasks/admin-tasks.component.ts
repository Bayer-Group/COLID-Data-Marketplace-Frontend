import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ClickedSidebarLink } from '../../../states/sidebar.state';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-tasks',
  templateUrl: './admin-tasks.component.html',
  styleUrls: ['./admin-tasks.component.css']
})
export class AdminTasksComponent {
  constructor(
    private store: Store,
    private authService: AuthService
  ) {}

  get hasSuperAdminPrivilege$(): Observable<boolean> {
    return this.authService.hasSuperAdminPrivilege$;
  }

  linkClicked() {
    this.store.dispatch(new ClickedSidebarLink()).subscribe();
  }
}
