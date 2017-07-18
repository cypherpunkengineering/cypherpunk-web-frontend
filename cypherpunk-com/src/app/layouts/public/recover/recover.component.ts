import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
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
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.document.title = 'Reset your password for Cypherpunk Privacy'; }

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
    if (!this.validateEmail()) { return; }
    this.recoverButtonDisabled = true;
    // call server here
    console.log('recover');
  }
}
