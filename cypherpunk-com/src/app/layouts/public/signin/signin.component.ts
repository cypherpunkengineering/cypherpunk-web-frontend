import { Router } from '@angular/router';
import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { Component, Inject, AfterViewInit, NgZone } from '@angular/core';

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
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Login to Cypherpunk Privacy Account'; }

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
