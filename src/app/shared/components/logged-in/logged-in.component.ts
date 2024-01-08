import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";

@Component({
  selector: "app-logged-in",
  templateUrl: "./logged-in.component.html",
  styleUrls: ["./logged-in.component.css"],
})
export class LoggedInComponent implements OnInit, OnDestroy {
  isBrowserSupported = false;
  checkAccSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAccSub = this.authService.subscribeCheckAccount();
  }

  ngOnDestroy(): void {
    this.checkAccSub.unsubscribe();
  }

  redirect() {
    this.authService.redirect();
  }
}
