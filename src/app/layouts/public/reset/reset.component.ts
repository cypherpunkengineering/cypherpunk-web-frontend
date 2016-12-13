import { Component, AfterViewInit, NgZone } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements AfterViewInit {
  email: string = '';
  resetButtonDisabled: boolean = false;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    if (isBrowser) {
      document.getElementById('reset-username').focus();
    }
  }

  validateReset () {
    if (!this.email.length) { return false; }
    return true;
  }

  reset() {
    this.resetButtonDisabled = true;
    // call server here
  }
}
