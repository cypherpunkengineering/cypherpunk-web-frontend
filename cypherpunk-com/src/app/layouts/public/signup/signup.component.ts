import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { BackendService } from '../../../services/backend.service';
import { Component, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements AfterViewInit {
  refToken: string;
  user = { email: '', password: '' };
  validEmail: boolean = false;
  emailTouched: boolean = false;
  validPassword: boolean = false;
  passwordTouched: boolean = false;
  signinButtonDisabled: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private route: ActivatedRoute,
    private backend: BackendService,
    private alertService: AlertService,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Create Account with Cypherpunk Privacy'; }

  ngAfterViewInit() {
    let params = this.route.snapshot.params;
    this.refToken = params['token'];
    if (!this.refToken) { this.router.navigate(['/']); }
    if (isBrowser) { document.getElementById('email').focus(); }
  }

  validatePassword() {
    this.passwordTouched = true;
    if (!this.user.password.length) { this.validPassword = false; }
    else { this.validPassword = true; }
  }

  validateEmail(): void {
    this.emailTouched = true;
    // check if email is already taken
    if (!this.user.email) { this.validEmail = false; return; }
    let body = { email: this.user.email };
    this.backend.identifyEmail(body, {})
    .then(() => {
      this.zone.run(() => { this.validEmail = false; });
    })
    .catch((data) => {
      this.zone.run(() => {
        if (data.status === 401) { this.validEmail = true; }
        else { this.validEmail = false; }
      });
    });
  }

  signup() {
    this.signinButtonDisabled = true;

    this.auth.signup(this.user)
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
