import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class PublicResetComponent implements AfterViewInit {
  resetToken: string;
  accountId: string;
  password = '';
  confirm = '';
  errors = {
    password: { touched: false, message: '' },
    confirm: { touched: false, message: '' }
  };
  resetButtonDisabled = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private backend: BackendService,
    private session: SessionService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Reset Your Password';

    // replace history
    if (isPlatformBrowser(this.platformId)) {
      history.replaceState({}, document.title, document.location.origin);
    }

    // check resetToken exists
    let route = this.activatedRoute.snapshot;
    this.resetToken = route.queryParams['recoveryToken'];
    this.accountId = route.queryParams['accountId'];
    if (!this.resetToken || !this.accountId) { this.router.navigate(['/']); }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { document.getElementById('password').focus(); }
  }

  validatePassword() {
    let valid = false;
    this.errors.password.touched = true;

    if (!this.password) {
      this.errors.password.message = 'Password is Required';
    }
    else if (this.password.length < 6) {
      this.errors.password.message = 'Password needs to be 6 characters or longer';
    }
    else {
      valid = true;
      this.errors.password.message = '';
    }

    return valid;
  }

  validateConfirm () {
    let valid = false;
    this.errors.confirm.touched = true;

    if (!this.confirm) {
      this.errors.confirm.message = 'Confirmation is Required';
    }
    else if (this.password.length < 6) {
      this.errors.confirm.message = 'Password needs to be 6 characters or longer';
    }
    else if (this.password !== this.confirm) {
      this.errors.confirm.message = 'Password and Confirmation do not match';
    }
    else {
      valid = true;
      this.errors.confirm.message = '';
    }

    return valid;
  }

  reset() {
    let password = this.validatePassword();
    let confirm = this.validateConfirm();
    if (!password || !confirm || this.resetButtonDisabled) { return; }
    this.resetButtonDisabled = true;

    let body = { accountId: this.accountId, token: this.resetToken, password: this.password };
    return this.backend.reset(body, {})
    .then((data) => {
      this.alertService.success('Your password has been reset, please login');
      this.router.navigate(['login']);
    })
    .catch((err) => {
      console.log(err);
      this.alertService.error('Could not reset your password');
    });
  }
}
