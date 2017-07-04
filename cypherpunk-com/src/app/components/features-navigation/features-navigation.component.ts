import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, HostListener, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'features-navigation',
  templateUrl: './features-navigation.component.html',
  styleUrls: ['./features-navigation.component.css']
})
export class FeaturesNavigationComponent implements AfterViewInit {
  @Input() inNavigation: boolean;
  @Input() inNavigationMobile: boolean;

  hide: boolean;
  onPage: boolean;
  currentTab: string;

  constructor(private router: Router) {
    // check if on /features page
    if (this.router.url.startsWith('/features')) { this.onPage = true; }

    // parse fragment into currentTab
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.currentTab = tree.fragment; }
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
    let featuresNavigation = <HTMLElement> document.querySelector('.features-navigation.page');
    let clientHeight = nav.clientHeight || scrolledNav.clientHeight;
    if (!featuresNavigation) { return; }

    // masthead height - nav height
    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      if (currentPosition > (featuresNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
