import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent {
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
