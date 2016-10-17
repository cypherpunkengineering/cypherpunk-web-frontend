import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  constructor(router: Router) {
    router.events.subscribe(s => {
      if (s instanceof NavigationEnd) {
        const tree = router.parseUrl(router.url);
        if (tree.fragment) {
          // you can use DomAdapter
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView({
             behavior: 'smooth'
            });
          }
        }
      }
    });
  }
}
