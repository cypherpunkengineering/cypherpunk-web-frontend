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
    let router = this.router;

    this.auth.login(this.user)
    .then(() => { router.navigate(['user']); })
    .catch(function(err) {
      console.log(err);
      alertService.error('Could not log in');
    });
  }
}
