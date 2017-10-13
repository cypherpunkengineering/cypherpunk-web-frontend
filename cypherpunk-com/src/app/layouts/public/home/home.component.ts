import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';


@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  refToken: string;
  user = { email: '', password: '', confirm: '' };
  errors = {
    email: { message: '', exists: true, touched: false },
    password: { message: '', touched: false },
    confirm: { message: '', touched: false }
  };
  signupButtonDisabled = false;


  constructor(
    private zone: NgZone,
    private router: Router,
    private seo: SeoService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private backend: BackendService,
    private alertService: AlertService,
    @Inject (PLATFORM_ID) private platformId: Object
  ) { seo.updateMeta(); }

  ngAfterViewInit() {
    let params = this.route.snapshot.params;
    this.refToken = params['token'];
    // if (!this.refToken) { this.router.navigate(['/']); }
    if (isPlatformBrowser(this.platformId)) { document.getElementById('email').focus(); }
  }

  passwordRegex(password) {
    return /^[\x21-\x7E]*$/.test(password);
  }

  checkEmailExists() {
    // check if email is already taken
    if (!this.user.email) { return; }
    if (!/^\S+@\S+$/.test(this.user.email)) { return; }
    let body = { email: this.user.email };
    this.backend.identifyEmail(body, {})
    .then(() => {
      this.zone.run(() => {
        this.errors.email.exists = true;
        this.errors.email.message = 'This Email already exists';
      });
    })
    .catch((data) => {
      this.zone.run(() => {
        if (data.status === 401) { this.errors.email.exists = false; }
        else { this.errors.email.exists = true; }
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
    else if (!this.passwordRegex(this.user.password)) {
      this.errors.password.message = 'Password contains invalid characters';
    }
    else if (this.user.password.length < 6) {
      this.errors.password.message = 'Password must be at least 6 characters';
    }
    else {
      valid = true;
      this.errors.password.message = '';
    }

    return valid;
  }

  validateConfirm() {
    let valid = false;
    this.errors.confirm.touched = true;

    if (!this.user.password) {
      this.errors.confirm.message = 'Password is Required';
    }
    else if (this.user.password !== this.user.confirm) {
      this.errors.confirm.message = 'Password and Confirmation must be the same';
    }
    else {
      valid = true;
      this.errors.confirm.message = '';
    }

    return valid;
  }

  signup() {
    this.checkEmailExists();
    let email = this.validateEmail();
    let password = this.validatePassword();
    let confirm = this.validateConfirm();
    if (!email || !password || confirm || this.errors.email.exists || this.signupButtonDisabled) { return; }
    this.signupButtonDisabled = true;

    if (isPlatformBrowser(this.platformId)) {
      let paq = (<any>window)._paq;
      paq.push(['trackGoal', 16]);
    }

    this.auth.signup({
      emall: this.user.email,
      password: this.user.password
    })
    .then(() => { this.router.navigate(['account']); })
    .catch((err) => {
      this.zone.run(() => {
        this.signupButtonDisabled = false;
        this.alertService.error('Could not sign in: ' + err.message);
      });
    });
  }

}
