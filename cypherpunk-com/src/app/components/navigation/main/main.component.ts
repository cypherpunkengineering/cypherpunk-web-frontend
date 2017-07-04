import { Router, NavigationEnd } from '@angular/router';
import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session.service';
import { GlobalsService } from '../../../services/globals.service';
import { PlatformBuilds } from '../../../layouts/public/apps/platform-builds';
import * as platform from 'platform';

@Component({
  selector: 'app-nav',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class NavigationComponent {
  env: string;
  enableLinks = true;
  showDropDown = false;
  scrolledNavElement: HTMLElement;
  scrolledMobileNavElement: HTMLElement;

  link: string;
  pageRedirect: string;

  bannerModel;
  androidModel = {
    heading: 'Cypherpunk Privacy',
    subheading: 'Get it free on the Play Store',
    type: 'android',
    link: PlatformBuilds.android.link
  };
  iosModel = {
    heading: 'Cypherpunk Privacy',
    subheading: 'Get it free on the App Store',
    type: 'ios',
    link: PlatformBuilds.ios.link
  };

  constructor(
    private router: Router,
    private auth: AuthService,
    private globals: GlobalsService,
    private session: SessionService
  ) {
    // detect env
    this.env = globals.ENV;

    // detect route
    if (this.router.url.startsWith('/pricing')) { this.enableLinks = false; }
    if (this.router.url.startsWith('/login')) { this.enableLinks = false; }

    // detect os setup
    let os = platform.os.family || '';
    if (os.indexOf('OS X') > -1) {
      this.link = PlatformBuilds.macos.link;
      this.pageRedirect = '/apps/macos/download';
    }
    else if (os.indexOf('Window') > -1) {
      this.link = PlatformBuilds.windows.link;
      this.pageRedirect = '/apps/windows/download';
    }
    else if (os.indexOf('Android') > -1) { this.link = PlatformBuilds.android.link; }
    else if (os.indexOf('iOS') > -1) { this.link = PlatformBuilds.ios.link; }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint') > -1) {
      this.link = PlatformBuilds.linuxVersions[0].link;
      this.pageRedirect = '/apps/linux/download';
    }
    else { this.link = '#'; }

    // handle mobile banner modal
    if (os.indexOf('Android') > -1) { this.bannerModel = this.androidModel; }
    else if (os.indexOf('iOS') > -1) { this.bannerModel = this.iosModel; }
  }

  getAccountType() {
    if (this.session.user.account.type) {
      return this.session.user.account.type;
    }
    else { return ''; }
  }

  isLoggedIn() {
    let loggedIn = false;
    let authed = this.auth.authed;
    let sessionFound = this.session.userFound;
    if (authed || sessionFound) { loggedIn = true; }
    return loggedIn;
  }

  redirect() {
    this.router.navigate([this.pageRedirect]);
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
