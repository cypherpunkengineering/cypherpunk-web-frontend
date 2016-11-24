import { Component, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements AfterViewInit {
  ngAfterViewInit() {
    document.getElementById('reset-username').focus();
  }
}
