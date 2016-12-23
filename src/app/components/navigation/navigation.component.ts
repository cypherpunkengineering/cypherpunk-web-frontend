import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  showDropDown = false;
  scrolledNavElement: HTMLElement;

  constructor(private auth: AuthService, private session: SessionService) {}

  isLoggedIn() {
    let authLogin = this.auth.authed;
    let sessionLogin = this.session.userFound;
    if (authLogin || sessionLogin) { return true; }
    else { return false; }
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
