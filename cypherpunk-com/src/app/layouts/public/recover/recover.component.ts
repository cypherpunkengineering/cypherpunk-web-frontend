import { isBrowser } from 'angular2-universal';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent implements AfterViewInit {
  email: string = '';
  recoverButtonDisabled: boolean = false;

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) private document: any
  ) { this.document.title = 'Reset your password for Cypherpunk Privacy'; }

  ngAfterViewInit() {
    if (isBrowser) { document.getElementById('recover-username').focus(); }
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
