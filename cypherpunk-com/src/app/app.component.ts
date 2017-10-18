import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <app-noscript></app-noscript>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) { return; }

        let paq = (<any>window)._paq;
        if (evt.urlAfterRedirects === '/404') {
          let event = 'setDocumentTitle';
          let title = '404/URL = ';
          title = title + encodeURIComponent(document.location.pathname + document.location.search)
          title = title +  '/From = ' + encodeURIComponent(document.referrer);
          paq.push([event, title]);
        }

        // track each page render
        paq.push(['trackPageView']);

        // handle hash anchor scroll
        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          const element = document.querySelector('#' + tree.fragment);
          if (element) { element.scrollIntoView({ behavior: 'smooth' }); }
        }
        else { document.body.scrollTop = 0; }
      });
    }
  }
}
