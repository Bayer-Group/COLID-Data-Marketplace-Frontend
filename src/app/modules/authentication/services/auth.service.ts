import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { Injectable, Inject } from '@angular/core';
import { IDENT_PROV } from 'src/app/shared/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(@Inject(IDENT_PROV) private identityProvider: IdentityProvider, private router: Router) { }

  get currentIdentity(): ColidAccount {
    return this.identityProvider.getAccount();
  }

  get currentEmail(): string {
    return this.currentIdentity.email;
  }

  get currentName(): string {
    return this.currentIdentity.name;
  }

  get currentUserId(): string {
    return this.currentIdentity.accountIdentifier;
  }

  get isLoggedIn(): boolean {
    return this.identityProvider.isLoggedIn;
  }

  get loginInProgress(): boolean {
    return this.identityProvider.loginInProgress();
  }

  get currentUserRoles(): any {
    return this.currentIdentity.roles;
  }

  get isAuthorized(): Observable<boolean> {
    return of(this.isLoggedIn);
  }

  get isLoadingUser(): boolean {
    return false;
  }

  get accessToken(): string {
    return localStorage.getItem('msal.idtoken')
  }

  checkAccount() {
    if (!this.isLoggedIn) {
      if (!this.loginInProgress) {
        this.login();
      }
    } else {
      this.redirect();
    }
  }

  redirect() {
    const redirectPathString = window.sessionStorage.getItem('url');
    const queryParamString = window.sessionStorage.getItem('queryParams');

    if (redirectPathString == null && queryParamString == null) {
      this.router.navigate(['']);
      return;
    }

    const redirectPath = JSON.parse(redirectPathString);
    const queryParams = JSON.parse(queryParamString);
    this.router.navigate(redirectPath, { queryParams: queryParams });
  }

  login() {
    this.identityProvider.login();
  }

  logout() {
    this.identityProvider.logout();
  }
}
