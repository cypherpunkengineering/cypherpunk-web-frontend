import { Component, AfterViewInit, NgZone } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.scss']
})
export class RecoverComponent implements AfterViewInit {
  email: string = '';
  recoverButtonDisabled: boolean = false;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    if (isBrowser) {
      document.getElementById('recover-username').focus();
    }
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
