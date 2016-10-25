import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    this.auth.login(this.user)
    .then((val) => {
      this.router.navigate(['user']);
    });
  }
}
