import { Injectable } from "@angular/core";
import { IdentityProvider } from "./identity-provider.service";
import { Constants } from "src/app/shared/constants";
import { ColidAccount } from "../models/colid-account.model";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MockIdentityProvider implements IdentityProvider {
  constructor() {}

  getAccount(): Observable<ColidAccount> {
    const idTokenClaimes = [
      Constants.Authentication.Roles.Administration,
      Constants.Authentication.EditorRoles.Administration,
      Constants.Authentication.EditorRoles.SuperAdministration,
      "PID.Group10Data.ReadWrite",
      "PID.Group11Data.ReadWrite",
    ];
    return of(
      new ColidAccount(
        "SuperAdmin",
        "superadmin@bayer.com",
        "87654321-4321-4321-4321-210987654321",
        idTokenClaimes
      )
    );
  }

  loginInProgress(): boolean {
    return false;
  }

  get isLoggedIn$(): Observable<boolean> {
    return of(true);
  }

  login(): void {}

  logout(): void {}
}
