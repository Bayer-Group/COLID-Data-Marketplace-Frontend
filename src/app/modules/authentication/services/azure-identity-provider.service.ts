import { Inject, Injectable } from '@angular/core';
import { IdentityProvider } from './identity-provider.service';
import { ColidAccount } from '../models/colid-account.model';
import { MsalService,  MsalBroadcastService } from '@azure/msal-angular';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { mergeMap, map, filter ,takeUntil} from 'rxjs/operators';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root'
})
export class AzureIdentityProvider implements IdentityProvider {

  isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _destroying$ = new Subject<void>();
  loggingIn: boolean = false;
  loginDisplay: boolean = false;
  currentStatus: InteractionStatus = InteractionStatus.None;
  constructor(@Inject(MsalService) private msalService: MsalService, private broadcastService: MsalBroadcastService) {
    this.isLoggedIn$.next(this.checkLoggedIn());

    //set local variable when login started
    this.broadcastService.inProgress$.pipe(
      filter(
        (status: InteractionStatus) => status === InteractionStatus.Login
      ),
      takeUntil(this._destroying$)
    )
      .subscribe(
        r => this.loggingIn = true
      );

    //set local variable when login finished
    this.broadcastService.inProgress$.pipe(
      filter(
        (status: InteractionStatus) => status === InteractionStatus.None
      ),
      takeUntil(this._destroying$)
    )
      .subscribe(
        r => this.loggingIn = false
      );

    this.broadcastService.inProgress$.subscribe(r => this.currentStatus = r);



    this.broadcastService.msalSubject$
      .pipe(
        filter(
          (ev: EventMessage) => ev.eventType === EventType.LOGIN_SUCCESS
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(
        r => this.isLoggedIn$.next(this.checkLoggedIn())
      );

    this.broadcastService.msalSubject$
      .pipe(
        filter(
          (ev: EventMessage) => ev.eventType === EventType.ACQUIRE_TOKEN_FAILURE
        ),
        takeUntil(this._destroying$)
      )
      .subscribe(
        r => {
          console.error("Failed getting token", r.error);
          const loggedIn = this.checkLoggedIn();

          this.isLoggedIn$.next(loggedIn);

          if (!loggedIn && !this.loginInProgress) {
            this.login();
          }
        }
      )
  }

  checkLoggedIn(): boolean {
    const loggedIn = this.msalService.instance.getAllAccounts().length > 0;
    if (loggedIn) {
      const tokenValid = (this.msalService.instance.getAllAccounts()[0].idTokenClaims)['exp'] > new Date().getSeconds()
      return tokenValid;
    } else {
      return false;
    }
  }

  getAccount(): Observable<ColidAccount> {
    let azureAccount: any;
    return this.isLoggedIn$.pipe(map(isLoggedIn => {
      if (!azureAccount && this.msalService.instance.getAllAccounts().length > 0) {
        let accounts = this.msalService.instance.getAllAccounts();
        this.msalService.instance.setActiveAccount(accounts[0]);
        azureAccount = accounts[0];
      } else {
        azureAccount = this.msalService.instance.getActiveAccount();
      }
      if (!isLoggedIn) {
        return null;
      } else {
        const accountRoles: any = (azureAccount.idTokenClaims)['roles'];
        return new ColidAccount(azureAccount.name, azureAccount.username, azureAccount.localAccountId, accountRoles)
      }
    }))
  }

  loginInProgress(): boolean {
    return this.loggingIn;
  }

  async login(): Promise<void> {
    // If the login is happening in a Iframe we need to delay it so it does not create a infinte loop
    this.broadcastService.inProgress$.pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    ).subscribe(
      () => {
        if (window.self !== window.top) {
          setTimeout(async () => {
            await this.msalService.loginRedirect();
          }, 5000)
        } else {
          this.msalService.loginRedirect();
        }
      }
    )
    // if (this.currentStatus == InteractionStatus.None) {
      
    // }
  }

  logout(): void {
    this.msalService.logout();
  }
}
