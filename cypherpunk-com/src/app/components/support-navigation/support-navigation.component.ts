import { Router } from '@angular/router';
import { Component, Input, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'support-navigation',
  templateUrl: './support-navigation.component.html',
  styleUrls: ['./support-navigation.component.css']
})
export class SupportNavigationComponent implements AfterViewInit {
  @Input() page: string;
  @Input() inNavigation: boolean;
  @Input() inNavigationMobile: boolean;

  hide: boolean;
  onPage: boolean;

  constructor(private router: Router) {
    // check if on /apps page
    if (this.router.url.startsWith('/support')) { this.onPage = true; }

    // set path param value
    if (this.router.url.endsWith('windows')) { this.page = 'windows' }
    else if (this.router.url.endsWith('mac')) { this.page = 'mac' }
    else if (this.router.url.endsWith('macos')) { this.page = 'macos' }
    else if (this.router.url.endsWith('linux')) { this.page = 'linux' }
    else if (this.router.url.endsWith('ios')) { this.page = 'ios' }
    else if (this.router.url.endsWith('android')) { this.page = 'android' }
    else if (this.router.url.endsWith('browser')) { this.page = 'browser' }
    else if (this.router.url.endsWith('routers')) { this.page = 'routers' }
    else if (this.router.url.endsWith('embedded')) { this.page = 'others' }
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
    let supportNavigation = <HTMLElement> document.querySelector('.support-navigation.page');
    let clientHeight = nav.clientHeight || scrolledNav.clientHeight;
    if (!supportNavigation) { return; }

    // masthead height - nav height
    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      if (currentPosition > (supportNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
