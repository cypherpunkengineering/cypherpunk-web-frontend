import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements AfterViewInit {
  resetToken: string;
  accountId: string;
  password = '';
  confirm = '';
  errors = {
    password: { touched: false, message: '' },
    confirm: { touched: false, message: '' }
  };
  activateButtonDisabled = false;

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
    this.document.title = 'Activate Your Account';

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
    else if (this.password !== this.confirm) {
      this.errors.confirm.message = 'Password and Confirmation do not match';
    }
    else {
      valid = true;
      this.errors.confirm.message = '';
    }

    return valid;
  }

  activate() {
    let password = this.validatePassword();
    let confirm = this.validateConfirm();
    if (!password || !confirm || this.activateButtonDisabled) { return; }
    this.activateButtonDisabled = true;

    let body = { accountId: this.accountId, token: this.resetToken, password: this.password };
    return this.backend.reset(body, {})
    .then((data) => {
      this.alertService.success('Congratulations! You have been granted a free preview account.');
      this.router.navigate(['account']);
    })
    .catch((err) => {
      console.log(err);
      this.activateButtonDisabled = false;
      this.alertService.error('Could not activate your password');
    });
  }
}