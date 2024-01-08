import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { combineLatest } from "rxjs";
import { AuthGuardService } from "./auth-guard.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuardSuperAdminService
  extends AuthGuardService
  implements CanActivate
{
  constructor(protected authService: AuthService, protected router: Router) {
    super(authService, router);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return combineLatest([
      this.authService.isLoggedIn$,
      this.authService.hasSuperAdminPrivilege$,
    ]).pipe(
      map(([isLoggedIn, hasSuperAdminPrivilege]) => {
        const isAuthorized = this.processLoggedIn(isLoggedIn, route, state);

        if (isAuthorized && !hasSuperAdminPrivilege) {
          this.router.navigate(["/unauthorized"]);
        }
        return hasSuperAdminPrivilege;
      })
    );
  }
}
