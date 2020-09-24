import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'app-login-in-progress',
  templateUrl: './login-in-progress.component.html',
  styleUrls: ['./login-in-progress.component.css']
})
export class LoginInProgressComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.checkAccount();
   }

}
