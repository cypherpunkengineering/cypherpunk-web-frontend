import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { AlertService } from '../../../services/alert.service';
import { GlobalsService } from '../../../services/globals.service';
import { SessionService } from '../../../services/session.service';
import { Component, HostListener, NgZone } from '@angular/core';

@Component({
  selector: 'app-acc-nav',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountNavigationComponent {
  user: any;
  env: string;
  enableLinks = true;
  showDropDown = false;
  scrolledNavElement: HTMLElement;

  constructor(
    private zone: NgZone,
    private router: Router,
    private auth: AuthService,
    private session: SessionService,
    private globals: GlobalsService,
    private alertService: AlertService
  ) {
    // detect route
    if (this.router.url.startsWith('/account/upgrade')) { this.enableLinks = false; }

    // assign user from session
    this.env = globals.ENV;
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
    let accountType = this.user.account.type;
    let subType = this.user.subscription.type;
    let renews = this.user.subscription.renews;

    if (accountType === 'free' || accountType === 'expired') { return true; }
    else if (accountType === 'premium') {
      if (renews === false) { return true; }
      if (subType !== 'annually' && subType !== 'forever') { return true;
      }
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
