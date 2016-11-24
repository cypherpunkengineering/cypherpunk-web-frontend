import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  user = { login: '', password: '' };

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService
  ) { }

  ngAfterViewInit() {
    document.getElementById('login-username').focus();
  }

  login() {
    this.auth.login(this.user)
    .then(() => {
      let redirectUrl = this.auth.redirectUrl;
      if (redirectUrl) { this.router.navigate([redirectUrl]); }
      else { this.router.navigate(['user']); }
    })
    .catch((err) => {
      console.log(err);
      this.alertService.error('Could not log in');
    });
  }
}
