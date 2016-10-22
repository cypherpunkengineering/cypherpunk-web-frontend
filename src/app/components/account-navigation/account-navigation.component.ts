import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acc-nav',
  templateUrl: './account-navigation.component.html',
  styleUrls: ['./account-navigation.component.scss']
})
export class AccountNavigationComponent {
  showDropDown = false;

  constructor(private router: Router, private auth: AuthService) { }

  logOff() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
