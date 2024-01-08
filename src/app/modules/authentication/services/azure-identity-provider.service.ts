import { Inject, Injectable } from "@angular/core";
import { IdentityProvider } from "./identity-provider.service";
import { ColidAccount } from "../models/colid-account.model";
import { MsalService, MsalBroadcastService } from "@azure/msal-angular";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { map, filter, takeUntil, switchMap } from "rxjs/operators";
import {
  EventMessage,
  EventType,
  InteractionStatus,
} from "@azure/msal-browser";

@Injectable({
  providedIn: "root",
})
export class AzureIdentityProvider implements IdentityProvider {
  isLoggedIn$: BehaviorSubject<boolean | null> = new BehaviorSubject(null);
  private readonly _destroying$ = new Subject<void>();
  loggingIn: boolean = false;
  constructor(
    @Inject(MsalService) private msalService: MsalService,
    private broadcastService: MsalBroadcastService
  ) {
    //set local variable when login started
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.Login
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((_) => (this.loggingIn = true));

    //set local variable when login finished
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((_) => {
        this.checkLoggedIn();
      });

    this.broadcastService.inProgress$.subscribe((r) =>
      console.log("interaction status", r)
    );

    this.broadcastService.msalSubject$
      .pipe(
        filter(
          (ev: EventMessage) => ev.eventType === EventType.ACQUIRE_TOKEN_FAILURE
        ),
        takeUntil(this._destroying$)
      )
      .subscribe((r) => {
        console.error("Failed getting token", r.error);
        this.checkLoggedIn();

        if (this.isLoggedIn$.value === false && !this.loginInProgress) {
          this.login();
        }
      });
  }

  checkLoggedIn() {
    const loggedIn = this.msalService.instance.getAllAccounts().length > 0;
    if (loggedIn) {
      const tokenValid =
        this.msalService.instance.getAllAccounts()[0].idTokenClaims["exp"] >
        new Date().getSeconds();
      this.isLoggedIn$.next(tokenValid);
    } else {
      this.isLoggedIn$.next(false);
    }
  }

  getAccount(): Observable<ColidAccount | null> {
    let azureAccount: any;
    return this.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          let activeAccount = this.msalService.instance.getActiveAccount();

          if (
            !activeAccount &&
            this.msalService.instance.getAllAccounts().length > 0
          ) {
            let accounts = this.msalService.instance.getAllAccounts();
            this.msalService.instance.setActiveAccount(accounts[0]);
            azureAccount = accounts[0];
            const accountRoles: any = azureAccount.idTokenClaims["roles"];
            return new ColidAccount(
              azureAccount.name,
              azureAccount.username,
              azureAccount.localAccountId,
              accountRoles
            );
          }

          const accountRoles: any = activeAccount.idTokenClaims["roles"];
          return new ColidAccount(
            activeAccount.name,
            activeAccount.username,
            activeAccount.localAccountId,
            accountRoles
          );
        } else {
          return null;
        }
      })
    );
  }

  loginInProgress(): boolean {
    return this.loggingIn;
  }

  login(): void {
    // If the login is happening in a Iframe we need to delay it so it does not create a infinte loop
    this.broadcastService.inProgress$
      .pipe(
        filter(
          (status: InteractionStatus) => status === InteractionStatus.None
        ),
        switchMap(() => this.msalService.loginRedirect()),
        takeUntil(this._destroying$)
      )
      .subscribe();
  }

  logout(): void {
    this.msalService.logout();
  }

  // cleanup subscriptions
  cleanup(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}
