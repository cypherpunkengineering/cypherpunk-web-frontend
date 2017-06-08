import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { SessionService } from '../../services/session.service';
import { Component, HostListener, NgZone } from '@angular/core';

@Component({
  selector: 'app-acc-nav',
  templateUrl: './account-navigation.component.html',
  styleUrls: ['./account-navigation.component.css']
})
export class AccountNavigationComponent {
  user: any;
  enableLinks = true;
  showDropDown = false;
  scrolledNavElement: HTMLElement;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private alertService: AlertService
  ) {
    // detect route
    if (this.router.url.startsWith('/account/upgrade')) { this.enableLinks = false; }

    // assign user from session
    this.user = session.user;
  }

  signout() {
    this.auth.signout()
    .then(() => { this.router.navigate(['/']); })
    .catch((err) => {
      this.zone.run(() => {
        this.alertService.error('Could not sign out: ' + err);
      });
    });
  }

  showPriceBoxes() {
    let type = this.user.account.type;
    let renewal = this.user.subscription.renewal;

    if (type === 'free') { return true; }
    else if (type === 'premium') {
      if (renewal !== 'annually' && renewal !== 'forever') { return true; }
    }
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
