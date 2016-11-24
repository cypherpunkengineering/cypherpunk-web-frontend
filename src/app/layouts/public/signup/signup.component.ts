import { Component, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements AfterViewInit {
  ngAfterViewInit() {
    document.getElementById('signup-username').focus();
  }
}
