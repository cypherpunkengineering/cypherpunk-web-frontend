import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-noscript></app-noscript>
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) { return; }

        const tree = this.router.parseUrl(this.router.url);
        if (this.router.url.startsWith('/about-us')) { document.body.scrollTop = 0; }
        else if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
        }
        else { document.body.scrollTop = 0; }
      });
    }
  }
}
