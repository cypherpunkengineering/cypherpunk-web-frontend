import { Router } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-acc-nav',
  templateUrl: './account-navigation.component.html',
  styleUrls: ['./account-navigation.component.scss']
})
export class AccountNavigationComponent {
  user: any;
  showDropDown = false;
  scrolledNavElement: HTMLElement;

  constructor(
    private router: Router,
    private auth: AuthService,
    private session: SessionService
  ) { this.user = session.user; }

  logout() {
    this.auth.logout()
    .then(() => { this.router.navigate(['/']); });
  }

  // on scroll,
  @HostListener('window:scroll', ['$event'])
  handleScrollEvent(event) {
    this.scrolledNavElement = document.getElementById('scrolled-nav');

    // we round here to reduce a little workload
    let currentPosition = Math.round(window.scrollY);

    if (currentPosition > 60 && this.scrolledNavElement) {
      this.scrolledNavElement.style.opacity = '1';
      this.scrolledNavElement.style.visibility = 'visible';
    }
    else {
      this.scrolledNavElement.style.opacity = '0';
      this.scrolledNavElement.style.visibility = 'hidden';
    }
  }
}
