import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { RouteExtension } from 'src/app/shared/extensions/route.extension';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    protected authService: AuthService,
    protected router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn) => this.processLoggedIn(isLoggedIn, route, state))
    );
  }

  protected processLoggedIn(
    isLoggedIn: boolean,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!isLoggedIn) {
      RouteExtension.SetRouteInStorage(route);
      this.router.navigate(['/login-in-progress']);
      return false;
    }
    return true;
  }
}
