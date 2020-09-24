import { Injectable, Inject } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { MsalService, BroadcastService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AzureIdentityProvider implements IdentityProvider {

  constructor(@Inject(MsalService) private msalService: MsalService, private broadcastService: BroadcastService) {
    const sub = this.broadcastService.subscribe('msal:acquireTokenFailure', x => {
      if (!this.isLoggedIn) {
        sub.unsubscribe();
        this.login();
      }
    });
  }

  get isLoggedIn(): boolean {
    const azureAccount = this.msalService.getAccount();

    return this.msalService.getAccount() != null && +azureAccount.idToken.exp > new Date().getSeconds()
  }

  getAccount(): ColidAccount {
    const azureAccount = this.msalService.getAccount();

    if (!this.isLoggedIn) {
      return null;
    }

    const accountRoles: any = azureAccount.idToken.roles;
    return new ColidAccount(azureAccount.name, azureAccount.userName, azureAccount.accountIdentifier, accountRoles)
  }

  loginInProgress(): boolean {
    return this.msalService.getLoginInProgress();
  }

  login(): void {
    this.msalService.loginRedirect();
  }

  logout(): void {
    this.msalService.logout();
  }
}
