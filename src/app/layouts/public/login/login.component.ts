import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  user = {
    login: '',
    password: ''
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService
  ) {}

  login() {
    let alertService = this.alertService;

    this.auth.login(this.user)
    .then(() => { this.router.navigate(['user']); })
    .catch(function() { alertService.error('Could not log in'); });
  }
}
