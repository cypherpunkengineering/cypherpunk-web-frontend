import { Component, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements AfterViewInit {
  email: string = '';
  resetButtonDisabled: boolean = false;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    document.getElementById('reset-username').focus();
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
