import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, Input, HostListener, PLATFORM_ID, Inject, AfterViewInit  } from '@angular/core';

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

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
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
    else if (this.router.url.endsWith('manual')) { this.page = 'manual' }
  }

  ngAfterViewInit() {
    // set hide navigation
    if (this.inNavigation || this.inNavigationMobile) { this.hide = true; }
    if (isPlatformBrowser(this.platformId)) {
      let links = document.querySelectorAll('.apps-navigation');
      for (let i = 0; i < links.length; i++) {
        links[i].addEventListener('touchend', this.pageChange.bind(this));
      }
    }
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

  pageChange(e) {
    if (e instanceof TouchEvent && e.target['dataset'].link) {
      this.router.navigate(['/apps/' + e.target['dataset'].link]);
    }
  }
}
