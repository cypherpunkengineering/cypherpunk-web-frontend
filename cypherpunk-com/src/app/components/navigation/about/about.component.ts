
import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, HostListener, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'aboutus-navigation',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutUsNavigationComponent implements AfterViewInit {
  @Input() inNavigation: boolean;
  @Input() inNavigationMobile: boolean;

  hide: boolean;
  onPage: boolean;
  currentTab: string;

  constructor(private router: Router) {
    // check if on /features page
    if (this.router.url.startsWith('/about-us')) { this.onPage = true; }

    // parse fragment into currentTab
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.currentTab = tree.fragment; }
      else { this.currentTab = 'punks'; }
    });
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
    let aboutusNavigation = <HTMLElement> document.querySelector('.aboutus-navigation.page');
    let clientHeight = nav.clientHeight || scrolledNav.clientHeight;
    if (!aboutusNavigation) { return; }

    // masthead height - nav height
    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      if (currentPosition > (aboutusNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
