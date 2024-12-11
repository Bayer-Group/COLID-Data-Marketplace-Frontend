import { Injectable } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { Constants } from 'src/app/shared/constants';
import { ColidAccount } from '../models/colid-account.model';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockIdentityProvider implements IdentityProvider {
  isLoggedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
  constructor() {
    setTimeout(() => this.isLoggedIn$.next(true), 200);
  }

  getAccount(): Observable<ColidAccount> {
    const idTokenClaimes = [
      Constants.Authentication.Roles.Administration,
      Constants.Authentication.EditorRoles.Administration,
      Constants.Authentication.EditorRoles.SuperAdministration,
      'PID.Group10Data.ReadWrite',
      'PID.Group11Data.ReadWrite'
    ];

    return of(
      new ColidAccount(
        'SuperAdmin',
        'superadmin@bayer.com',
        '87654321-4321-4321-4321-210987654321',
        // "87654321-4321-4321-4321-210987654325",
        idTokenClaimes
      )
    );
  }

  loginInProgress(): boolean {
    return false;
  }

  login(): void {}

  logout(): void {}

  cleanup(): void {}
}
