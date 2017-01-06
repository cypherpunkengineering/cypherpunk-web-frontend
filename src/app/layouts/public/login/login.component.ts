import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  user = { login: '', password: '' };
  loginButtonDisabled: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService
  ) { }

  ngAfterViewInit() {
    if (isBrowser) {
      document.getElementById('login-username').focus();
    }
  }

  validateLogin () {
    if (!this.user.login.length) { return false; }
    if (!this.user.password.length) { return false; }
    return true;
  }

  login() {
    this.loginButtonDisabled = true;

    this.auth.login(this.user)
    .then(() => {
      let redirectUrl = this.auth.redirectUrl;
      if (redirectUrl) { this.router.navigate([redirectUrl]); }
      else { this.router.navigate(['account']); }
    })
    .catch((err) => {
      console.log(err);
      this.zone.run(() => {
        this.loginButtonDisabled = false;
        this.alertService.error('Could not sign in');
      });
    });
  }
}
