import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from './auth-guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdminService extends AuthGuardService {
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {
    super(authService, router);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return combineLatest([
      this.authService.isLoggedIn$,
      this.authService.hasAdminPrivilege$,
      this.authService.hasSuperAdminPrivilege$
    ]).pipe(
      map(([isLoggedIn, hasAdminPrivilege, hasSuperAdminPrivilege]) => {
        const isAuthorized = this.processLoggedIn(isLoggedIn, route, state);
        const hasAnyAdminPrivilege =
          hasAdminPrivilege || hasSuperAdminPrivilege;

        if (isAuthorized && !hasAnyAdminPrivilege) {
          this.router.navigate(['/unauthorized']);
        }
        return hasAnyAdminPrivilege;
      })
    );
  }
}
