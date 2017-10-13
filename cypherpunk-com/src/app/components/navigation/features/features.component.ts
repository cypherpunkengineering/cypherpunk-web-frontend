import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, HostListener, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';

@Component({
  selector: 'features-navigation',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesNavigationComponent implements AfterViewInit {
  @Input() inNavigation: boolean;
  @Input() inNavigationMobile: boolean;

  hide: boolean;
  onPage: boolean;
  currentTab: string;
  privacyActive: boolean;
  accessActive: boolean;
  networkActive: boolean;
  freedomActive: boolean;
  securityActive: boolean;
  supportActive: boolean;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
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
    if (isPlatformBrowser(this.platformId)) {
      let links = document.querySelectorAll('.features-navigation ul a');
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
    let featuresNavigation = <HTMLElement> document.querySelector('.features-navigation.page');
    let clientHeight = nav.clientHeight || scrolledNav.clientHeight;
    if (!featuresNavigation) { return; }

    let inNav = document.querySelector('.features-navigation.inNav');
    let inNavMobile = document.querySelector('.features-navigation.inNavigationMobile');
    let privacy = document.getElementById('privacyAnchor');
    let access = document.getElementById('accessAnchor');
    let network = document.getElementById('networkAnchor');
    let freedom = document.getElementById('freedomAnchor');
    let security = document.getElementById('securityAnchor');
    let support = document.getElementById('supportAnchor');
    let thisElement = inNav || inNavMobile;
    let thisHeight = thisElement.clientHeight;
    let navHeight = clientHeight + thisHeight;

    // handle mobile nav
    if (navHeight === 0) { navHeight = 70; }
    else { navHeight = navHeight < 100 ? 250 : navHeight; }


    // if in navigation
    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      // masthead height - nav height
      if (currentPosition > (featuresNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }

      // scroll spy
      if (currentPosition > privacy.offsetTop - navHeight && currentPosition < access.offsetTop - navHeight) {
       this.privacyActive = true;
      }
      else { this.privacyActive = false; }

      if (currentPosition > access.offsetTop - navHeight && currentPosition < network.offsetTop - navHeight) {
       this.accessActive = true;
      }
      else { this.accessActive = false; }

      if (currentPosition > network.offsetTop - navHeight && currentPosition < freedom.offsetTop - navHeight) {
       this.networkActive = true;
      }
      else { this.networkActive = false; }

      if (currentPosition > freedom.offsetTop - navHeight && currentPosition < security.offsetTop - navHeight) {
       this.freedomActive = true;
      }
      else { this.freedomActive = false; }

      if (currentPosition > security.offsetTop - navHeight && currentPosition < support.offsetTop - navHeight) {
       this.securityActive = true;
      }
      else { this.securityActive = false; }

      if (currentPosition > support.offsetTop - navHeight) {
       this.supportActive = true;
      }
      else { this.supportActive = false; }
    }
  }

  pageChange(e) {
    if (e instanceof TouchEvent && e.target['dataset'].fragment) {
      this.router.navigate(['/features'], { fragment: e.target['dataset'].fragment});
    }
  }
}
