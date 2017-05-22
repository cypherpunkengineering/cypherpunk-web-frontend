import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, PLATFORM_ID, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements AfterViewInit {
  email = '';
  recoverButtonDisabled = false;

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { this.document.title = 'Reset your password for Cypherpunk Privacy'; }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) { document.getElementById('recover-username').focus(); }
  }

  validateRecover () {
    if (!this.email.length) { return false; }
    return true;
  }

  recover() {
    this.recoverButtonDisabled = true;
    // call server here
  }
}
