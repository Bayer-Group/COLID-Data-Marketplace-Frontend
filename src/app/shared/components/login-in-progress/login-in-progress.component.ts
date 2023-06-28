import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { EnsureBrowserSupportService } from "src/app/modules/browser-support/services/ensure-browser-support.service";

@Component({
  selector: "app-login-in-progress",
  templateUrl: "./login-in-progress.component.html",
  styleUrls: ["./login-in-progress.component.css"],
})
export class LoginInProgressComponent implements OnInit, OnDestroy {
  isBrowserSupported = false;
  constructor(
    private authService: AuthService,
    private browserSupport: EnsureBrowserSupportService
  ) {
    this.isBrowserSupported = browserSupport.isSupported();
  }
  checkAccountSubscribtion: Subscription;

  ngOnInit() {
    if (this.isBrowserSupported) {
      this.checkAccountSubscribtion = this.authService.subscribeCheckAccount();
    }
  }

  ngOnDestroy() {
    this.checkAccountSubscribtion.unsubscribe();
  }
}
