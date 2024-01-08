import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/modules/authentication/services/auth.service";

@Component({
  selector: "app-login-in-progress",
  templateUrl: "./login-in-progress.component.html",
  styleUrls: ["./login-in-progress.component.css"],
})
export class LoginInProgressComponent implements OnInit, OnDestroy {
  private checkAccSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.checkAccSub = this.authService.subscribeCheckAccount();
  }

  ngOnDestroy(): void {
    this.checkAccSub.unsubscribe();
  }
}
