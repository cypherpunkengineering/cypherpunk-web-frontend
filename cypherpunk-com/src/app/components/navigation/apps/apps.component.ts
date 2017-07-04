import { Router } from '@angular/router';
import { Component, Input, HostListener, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'apps-navigation',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsNavigationComponent implements AfterViewInit {
  @Input() page: string;
  @Input() inNavigation: boolean;
  @Input() inNavigationMobile: boolean;

  hide: boolean;
  onPage: boolean;

  constructor(private router: Router) {
    // check if on /apps page
    if (this.router.url.startsWith('/apps')) { this.onPage = true; }

    // set path param value
    if (this.router.url.endsWith('apps')) { this.page = 'apps' }
    else if (this.router.url.endsWith('windows')) { this.page = 'windows' }
    else if (this.router.url.endsWith('mac')) { this.page = 'mac' }
    else if (this.router.url.endsWith('macos')) { this.page = 'macos' }
    else if (this.router.url.endsWith('linux')) { this.page = 'linux' }
    else if (this.router.url.endsWith('ios')) { this.page = 'ios' }
    else if (this.router.url.endsWith('android')) { this.page = 'android' }
    else if (this.router.url.endsWith('browser')) { this.page = 'browser' }
    else if (this.router.url.endsWith('routers')) { this.page = 'routers' }
  }

  ngAfterViewInit() {
    // set hide navigation
    if (this.inNavigation || this.inNavigationMobile) { this.hide = true; }
  }

  // on scroll,
  @HostListener('window:scroll', ['$event'])
  handleScrollEvent(event) {
    let currentPosition = Math.round(window.scrollY);
    let nav = document.getElementById('nav');
    let scrolledNav = document.getElementById('scrolled-mobile-nav');
    let appsNavigation = <HTMLElement> document.querySelector('.apps-navigation.page');
    let clientHeight = nav.clientHeight || scrolledNav.clientHeight;
    if (!appsNavigation) { return; }

    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      // masthead height - nav height
      if (currentPosition > (appsNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
