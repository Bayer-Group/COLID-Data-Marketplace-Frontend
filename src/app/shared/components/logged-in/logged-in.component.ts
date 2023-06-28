import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";
import { EnsureBrowserSupportService } from "src/app/modules/browser-support/services/ensure-browser-support.service";

@Component({
  selector: "app-logged-in",
  templateUrl: "./logged-in.component.html",
  styleUrls: ["./logged-in.component.css"],
})
export class LoggedInComponent implements OnInit, OnDestroy {
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

  redirect() {
    this.authService.redirect();
  }
}
