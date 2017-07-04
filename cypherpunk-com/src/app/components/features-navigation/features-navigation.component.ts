import { Router, NavigationEnd } from '@angular/router';
import { Component, Input, HostListener, ViewChild, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'features-navigation',
  templateUrl: './features-navigation.component.html',
  styleUrls: ['./features-navigation.component.css']
})
export class FeaturesNavigationComponent implements AfterViewInit {
  @ViewChild('el') el;
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
    let element = this.el.nativeElement;
    let featuresNavigation = <HTMLElement> document.querySelector('.features-navigation.page');

    // we round here to reduce a little workload
    let currentPosition = Math.round(window.scrollY);
    if (this.inNavigation && this.onPage) {
      // masthead height - nav height
      if (currentPosition > 125) { this.hide = false; }
      else { this.hide = true; }
    }

    if (this.inNavigationMobile && this.onPage && featuresNavigation) {
      if (currentPosition > (featuresNavigation.offsetTop - 80)) { this.hide = false; }
      else { this.hide = true; }
    }
  }
}
