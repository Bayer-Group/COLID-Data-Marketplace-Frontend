import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(protected authService: AuthService, protected router: Router) { }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authService.isLoggedIn$.pipe(map(isLoggedIn => this.processLoggedIn(isLoggedIn, route)));
  }

  protected processLoggedIn(isLoggedIn: boolean, route: ActivatedRouteSnapshot): boolean {
    if (!isLoggedIn) {
      if (!this.authService.loginInProgress) {
        RouteExtension.SetRouteInStorage(route);
      }
      this.router.navigate(['/login-in-progress']);
      return false;
    }
    return true;
  }

}
