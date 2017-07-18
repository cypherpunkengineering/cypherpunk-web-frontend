import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class PublicResetComponent implements AfterViewInit {
  resetToken: string;
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
    this.resetToken = route.queryParams['resetToken'];
    if (!this.resetToken) { this.router.navigate(['/']); }

    // if token is not confirm, navigate to home page
    // backend.confirmToken({ token: this.resetToken }, {})
    // .catch(() => { this.router.navigate(['/']); });
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

  reset() {
    let password = this.validatePassword();
    let confirm = this.validateConfirm();
    if (!password || !confirm) { return; }
    this.resetButtonDisabled = true;

    // call server here
    // let body = { resetToken: this.resetToken, password: this.password };
    // return this.backend.confirmToken(body, {})
    // .then((data) => {
    //   // set user session data
    //   this.session.setUserData({
    //     account: { email: data['account']['email'] },
    //     secret: data['secret']
    //   });
    //   // turn auth on
    //   this.auth.authed = true;
    //   // navigate to account page
    //   this.router.navigate(['/']);
    // })
    // .catch(() => { this.router.navigate(['/']); });
  }
}
