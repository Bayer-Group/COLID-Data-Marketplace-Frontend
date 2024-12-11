import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class EditorPrivilegeGuard extends AuthGuardService {
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {
    super(authService, router);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return combineLatest([
      this.authService.isLoggedIn$,
      this.authService.hasEditorFunctionalitiesPrivilege$
    ]).pipe(
      map(([isLoggedIn, hasEditorFunctionalitiesPrivilege]) => {
        const isAuthorized = this.processLoggedIn(isLoggedIn, route, state);

        if (isAuthorized && !hasEditorFunctionalitiesPrivilege) {
          this.router.navigate(['/unauthorized']);
        }
        return hasEditorFunctionalitiesPrivilege;
      })
    );
  }
}
