import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { Injectable, Inject } from '@angular/core';
import { IDENT_PROV } from 'src/app/shared/constants';
import { Select } from '@ngxs/store';
import { UserInfoState, UserInfoStateModel } from 'src/app/states/user-info.state';
import { RolePermissions } from '../role-permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Select(UserInfoState) userInfoState$: Observable<UserInfoStateModel>;

  constructor(@Inject(IDENT_PROV) private identityProvider: IdentityProvider, private router: Router) { }

  get currentIdentity$(): Observable<ColidAccount> {
    return this.identityProvider.getAccount();
  }

  get currentEmail$(): Observable<string> {
    return this.currentIdentity$.pipe(map(id => id ? id.email : null));
  }

  get currentName$(): Observable<string> {
    return this.currentIdentity$.pipe(map(id => id ? id.name : null));
  }

  get currentUserId$(): Observable<string> {
    return this.currentIdentity$.pipe(map(id => id ? id.accountIdentifier : null));
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.identityProvider.isLoggedIn$;
  }

  get loginInProgress(): boolean {
    return this.identityProvider.loginInProgress();
  }

  get currentUserRoles$(): Observable<any> {
    return this.currentIdentity$.pipe(map(id => id ? id.roles : []));
  }

  get hasEditorFunctionalitiesPrivilege$(): Observable<boolean> {
    const permissionRegex = new RegExp("^(PID|COLID)(.*)(ReadWrite)$");
    return this.currentUserRoles$.pipe(
      map(roles => {
        if (roles == null) {
          return false;
        }
        if (roles.length > 0) {
          // filter out the 'Open For Everyone' consumer group
          return roles.some((role) => permissionRegex.test(role) && !role.includes('Group10Data'));
        }
        return false;
      })
    )
  }

  get hasAdminPrivilege$(): Observable<boolean> {
    return this.hasPrivileges(RolePermissions.Admin);
  }

  private hasPrivileges(rolePermissions: string[]): Observable<boolean> {
    return this.currentUserRoles$.pipe(map(roles => {
      if (roles == null) {
        return false;
      }
      if (roles.length > 0) {
        return roles.some(role => rolePermissions.includes(role))
      }
      return false;
    }))
  }

  get isLoadingUser(): boolean {
    return false;
  }

  get accessToken(): string {
    return localStorage.getItem('msal.idtoken')
  }

  get hasCreatePrivilege$(): Observable<boolean> {
    return this.userInfoState$.pipe(
      map(userInfo => userInfo.consumerGroups && userInfo.consumerGroups.length > 0)
    )
  }

  subscribeCheckAccount() {
    return this.isLoggedIn$.subscribe(val => {
      if (!val && !this.loginInProgress) {
        this.login()
      } else {
        this.redirect()
      }
    })
  }

  redirect() {
    const redirectPathString = window.sessionStorage.getItem('url');
    const queryParamString = window.sessionStorage.getItem('queryParams');

    if (redirectPathString == null || queryParamString == null) {
      this.router.navigate(['']);
      return;
    }

    const redirectPath = JSON.parse(redirectPathString);
    const queryParams = JSON.parse(queryParamString);
    this.router.navigate(redirectPath, { queryParams: queryParams });
  }

  login() {
    // If the login is happening in a Iframe we need to delay it so it does not create a infinte loop
    if (window.self !== window.top) {
      setTimeout(() => {
        this.identityProvider.login();
      }, 5000)
    } else {
      this.identityProvider.login();
    }
  }

  logout() {
    this.identityProvider.logout();
  }
}
