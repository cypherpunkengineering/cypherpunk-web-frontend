import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, ViewChild, NgZone, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './pricing-preview.component.html',
  styleUrls: ['./pricing-preview.component.css']
})
export class PricingPreviewComponent implements AfterViewInit {
  @ViewChild('priceBoxes') priceBoxes;
  refToken: string;
  user = { email: '', password: '' };
  errors = {
    email: { message: '', exists: true, touched: false },
    password: { message: '', touched: false }
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
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy & VPN Pricing',
      description: 'Pricing for Cypherpunk Online Privacy service.',
      url: '/pricing/previews'
    });
  }

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

  signup() {
    this.checkEmailExists();
    let email = this.validateEmail();
    let password = this.validatePassword();
    if (!email || !password || this.errors.email.exists || this.signupButtonDisabled) { return; }
    this.signupButtonDisabled = true;

    this.auth.signup(this.user)
    .then(() => { this.router.navigate(['account']); })
    .catch((err) => {
      this.zone.run(() => {
        this.signupButtonDisabled = false;
        this.alertService.error('Could not sign in: ' + err.message);
      });
    });
  }
}
