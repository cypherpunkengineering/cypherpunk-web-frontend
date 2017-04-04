import { Router } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import * as platform from 'platform';

@Component({
  selector: 'app-nav',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  enableLinks: boolean = true;
  showDropDown: boolean = false;
  scrolledNavElement: HTMLElement;
  scrolledMobileNavElement: HTMLElement;

  bannerModel;
  androidModel = {
    heading: 'Cypherpunk for Android',
    subheading: 'Get it free on the Play Store',
    link: 'https://play.google.com/store/apps/details?id=com.cypherpunk.privacy'
  };
  iosModel = {
    heading: 'Cypherpunk for iOS',
    subheading: 'Get it free on the App Store',
    link: 'https://itunes.apple.com/us/app/cypherpunk-privacy/id1174413930'
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private session: SessionService
  ) {
    // detect route
    if (this.router.url.startsWith('/pricing')) { this.enableLinks = false; }

    // detect os setup
    let os: string = platform.os.family;
    if (os.indexOf('Android') > -1) { this.bannerModel = this.androidModel; }
    else if (os.indexOf('iOS') > -1) { this.bannerModel = this.iosModel; }
  }

  isLoggedIn() {
    let authed = this.auth.authed;
    let sessionFound = this.session.userFound;
    if (authed || sessionFound) { return true; }
    else { return false; }
  }

  // on scroll,
  @HostListener('window:scroll', ['$event'])
  handleScrollEvent(event) {
    this.scrolledNavElement = document.getElementById('scrolled-nav');
    this.scrolledMobileNavElement = document.getElementById('scrolled-mobile-nav');

    // we round here to reduce a little workload
    let currentPosition = Math.round(window.scrollY);

    if (currentPosition > 60) {
      this.scrolledNavElement.style.opacity = '1';
      this.scrolledNavElement.style.visibility = 'visible';
      if (this.bannerModel && this.enableLinks) {
        this.scrolledMobileNavElement.style.opacity = '1';
        this.scrolledMobileNavElement.style.visibility = 'visible';
      }
    }
    else {
      this.scrolledNavElement.style.opacity = '0';
      this.scrolledNavElement.style.visibility = 'hidden';
      if (this.bannerModel && this.enableLinks) {
        this.scrolledMobileNavElement.style.opacity = '0';
        this.scrolledMobileNavElement.style.visibility = 'hidden';
      }
    }
  }
}
