import { Component, AfterViewInit, NgZone } from '@angular/core';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements AfterViewInit {
  username: string = '';
  email: string = '';
  password: string = '';
  signupButtonDisabled: boolean = false;

  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    document.getElementById('signup-username').focus();
  }

  validateSignup() {
    if (!this.username.length) { return false; }
    if (!this.email.length) { return false; }
    if (!this.password.length) { return false; }
    return true;
  }

  signup() {
    this.signupButtonDisabled = true;
    // call server here
  }
}
