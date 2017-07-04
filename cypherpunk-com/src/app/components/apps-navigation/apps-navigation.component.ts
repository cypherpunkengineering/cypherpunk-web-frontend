import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, HostListener, ViewChild, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'apps-navigation',
  templateUrl: './apps-navigation.component.html',
  styleUrls: ['./apps-navigation.component.css']
})
export class AppsNavigationComponent implements AfterViewInit {
  @ViewChild('el') el;
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
    let element = this.el.nativeElement;
    let appsNavigation = <HTMLElement> document.querySelector('.apps-navigation.page');

    // we round here to reduce a little workload
    let currentPosition = Math.round(window.scrollY);
    if (this.inNavigation && this.onPage) {
      // masthead height - nav height
      if (currentPosition > 64) { this.hide = false; }
      else { this.hide = true; }
    }

    if (this.inNavigationMobile && this.onPage && appsNavigation) {
      if (currentPosition > (appsNavigation.offsetTop - 80)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
