import { Component, AfterViewInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements AfterViewInit {
  user = { email: '', password: '' };
  signinButtonDisabled: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService
  ) { }

  ngAfterViewInit() {
    if (isBrowser) {
      document.getElementById('email').focus();
    }
  }

  validateSignin () {
    if (!this.user.email.length) { return false; }
    if (!this.user.password.length) { return false; }
    return true;
  }

  signin() {
    this.signinButtonDisabled = true;

    this.auth.signin(this.user)
    .then(() => {
      let redirectUrl = this.auth.redirectUrl;
      if (redirectUrl) { this.router.navigate([redirectUrl]); }
      else { this.router.navigate(['account']); }
    })
    .catch((err) => {
      this.zone.run(() => {
        this.signinButtonDisabled = false;
        this.alertService.error('Could not sign in: ' + err.message);
      });
    });
  }
}
