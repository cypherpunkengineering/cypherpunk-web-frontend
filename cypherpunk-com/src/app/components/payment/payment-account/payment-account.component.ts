import { Component, Input, NgZone } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-payment-account',
  templateUrl: './payment-account.component.html',
  styleUrls: ['./payment-account.component.css']
})
export class PaymentAccountComponent {
  @Input() accountFormData: any;

  user: any;
  errors = {
    email: { message: '', touched: false },
    password: { message: '', touched: false }
  };
  showSignin: boolean;
  signinButtonDisabled = false;

  constructor(
    private zone: NgZone,
    private auth: AuthService,
    private session: SessionService,
    private alertService: AlertService
  ) { this.user = session.user; }

  signout() {
    this.auth.signout()
    .catch((err) => {
      this.zone.run(() => {
        this.alertService.error('Could not sign out: ' + err);
      });
    });
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

    this.auth.signin({ email: this.user.email, password: this.user.password })
    .then(() => { this.showSignin = false; })
    .then(() => { this.signinButtonDisabled = false; })
    .then(() => { delete this.user.password; delete this.user.email; })
    .catch((err) => {
      this.zone.run(() => {
        this.signinButtonDisabled = false;
        this.alertService.error('Could not sign in: ' + err.message);
      });
    });
  }

}
