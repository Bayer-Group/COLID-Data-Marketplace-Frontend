import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authService.isLoggedIn) {
      if (!this.authService.loginInProgress) {
        RouteExtension.SetRouteInStorage(route);
      }
      this.router.navigate(['/login-in-progress']);
      return false;
    }

    return this.authService.isAuthorized.pipe(map(isAuthorized => {
      if (isAuthorized) {
        return true;
      } else {
        this.router.navigate(['/login-in-progress']);
        return false;
      }
    }));
  }

}
