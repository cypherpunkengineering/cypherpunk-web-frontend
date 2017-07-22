import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { AlertService } from '../../../services/alert.service';
import { BackendService } from '../../../services/backend.service';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements AfterViewInit {
  email = '';
  errors = { email: { touched: false, message: '' } };
  recoverButtonDisabled = false;

  constructor(
    private zone: NgZone,
    private backend: BackendService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.document.title = 'Reset your password for Cypherpunk Privacy';

    // check if email exists
    let route = this.activatedRoute.snapshot;
    this.email = route.queryParams['email'];
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { document.getElementById('recover-username').focus(); }
  }

  validateEmail() {
    let valid = false;
    this.errors.email.touched = true;

    if (!this.email) {
      this.errors.email.message = 'Email is Required';
    }
    else if (!/^\S+@\S+$/.test(this.email)) {
      this.errors.email.message = 'Email is not properly formatted';
    }
    else {
      valid = true;
      this.errors.email.message = '';
    }

    return valid;
  }

  recover() {
    if (!this.validateEmail() || this.recoverButtonDisabled) { return; }
    this.recoverButtonDisabled = true;

    this.backend.recover({ email: this.email }, {})
    .then(() => {
      this.alertService.success('An email with a link to recover your password has been sent.');
    })
    .catch((err) => {
      this.zone.run(() => {
        this.recoverButtonDisabled = false;
        this.alertService.error('Could not recover your account.');
      });
    });
  }
}
