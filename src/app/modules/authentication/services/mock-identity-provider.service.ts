import { Injectable } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { Constants } from 'src/app/shared/constants';
import { ColidAccount } from '../models/colid-account.model';

@Injectable({
  providedIn: 'root'
})
export class MockIdentityProvider implements IdentityProvider {

  constructor() { }

  getAccount(): ColidAccount{
    const idTokenClaimes: any = { roles: [ Constants.Authentication.Roles.Administration ]};
    return new ColidAccount('SuperAdmin', 'superadmin@bayer.com', '87654321-4321-4321-4321-210987654321', idTokenClaimes)
  }

  loginInProgress(): boolean {
    return false;
  }

  get isLoggedIn(): boolean {
    return true;
  }

  login(): void { }

  logout(): void { }
}
