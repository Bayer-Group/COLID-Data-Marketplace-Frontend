import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  styleUrls: ['./logged-in.component.css']
})
export class LoggedInComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    setTimeout(() => {
      this.authService.checkAccount();
    }, 2000);
  }

  redirect() {
    this.authService.redirect();
  }
}
