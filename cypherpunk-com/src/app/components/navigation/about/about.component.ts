
import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, HostListener, AfterViewInit } from '@angular/core';

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

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    // check if on /about page
    if (this.router.url.startsWith('/about')) { this.onPage = true; }
    if (this.router.url.endsWith('manifesto')) { this.currentTab = 'manifesto'; }
    else if (this.router.url.endsWith('inquiries')) { this.currentTab = 'inquiries'; }
    else if (this.router.url.endsWith('canary')) { this.currentTab = 'canary'; }
    else if (this.router.url.endsWith('who-we-are')) { this.currentTab = 'who-we-are'; }
    else if (this.router.url.endsWith('punks')) { this.currentTab = 'punks'; }
    else if (this.router.url.endsWith('facts')) { this.currentTab = 'factsy'; }
    else if (this.router.url.endsWith('assets')) { this.currentTab = 'assetsy'; }
    else { this.currentTab = 'manifesto'; }
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
    let clientHeight = (nav && nav.clientHeight) || (scrolledNav && scrolledNav.clientHeight) || 0;
    if (!aboutusNavigation) { return; }

    // masthead height - nav height
    if ((this.inNavigation || this.inNavigationMobile) && this.onPage) {
      if (currentPosition > (aboutusNavigation.offsetTop - clientHeight)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
