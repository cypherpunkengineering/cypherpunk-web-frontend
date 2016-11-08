import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
      this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) { return; }

        const tree = this.router.parseUrl(this.router.url);
        if (tree.fragment) {
          // you can use DomAdapter
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView({
             behavior: 'smooth'
            });
          }
        }
        else { document.body.scrollTop = 0; }
      });
    }
}
