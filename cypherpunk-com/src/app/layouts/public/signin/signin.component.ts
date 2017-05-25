import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements AfterViewInit {
  user = { email: '', password: '' };
  errors = {
    email: { message: '', touched: false },
    password: { message: '', touched: false }
  };
  signinButtonDisabled = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.document.title = 'Login to Cypherpunk Privacy Account'; }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { document.getElementById('email').focus(); }
  }

  validateEmail() {
    let valid = false;
    this.errors.email.touched = true;

    if (!this.user.email) {
      this.errors.email.message = 'Email is Required';
    }
    else if (!/^\S+@\S+$/.test(this.user.email)) {
      this.errors.email.message = 'Email is not properly formatted';
    }
    else {
      valid = true;
      this.errors.email.message = '';
    }

    return valid;
  }

  validatePassword() {
    let valid = false;
    this.errors.password.touched = true;

    if (!this.user.password) {
      this.errors.password.message = 'Password is Required';
    }
    else {
      valid = true;
      this.errors.password.message = '';
    }

    return valid;
  }

  signin() {
    let email = this.validateEmail();
    let password = this.validatePassword();
    if (!email || !password || this.signinButtonDisabled) { return; }
    this.signinButtonDisabled = true;

    this.auth.signin(this.user)
    .then(() => {
      let redirectUrl = this.auth.redirectUrl;
      if (redirectUrl) {
        this.auth.redirectUrl = '';
        this.router.navigate([redirectUrl]);
      }
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
