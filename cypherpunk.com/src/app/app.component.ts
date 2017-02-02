import { isBrowser } from 'angular2-universal';
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

  constructor(private router: Router) { }

  ngOnInit() {
    if (isBrowser) {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) { return; }

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
