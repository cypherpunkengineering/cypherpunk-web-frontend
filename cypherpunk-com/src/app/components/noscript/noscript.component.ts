import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noscript',
  templateUrl: './noscript.component.html',
  styleUrls: ['./noscript.component.css']
})
export class NoScriptComponent implements OnInit {
  showNoScript = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      if (this.router.url.startsWith('/account')) {
        this.showNoScript = true;
        return;
      }

      if (this.router.url.startsWith('/blog')) {
        this.showNoScript = true;
        return;
      }

      if (this.router.url.startsWith('/support')) {
        this.showNoScript = true;
        return;
      }

      if (this.router.url.startsWith('/signup')) {
        this.showNoScript = true;
        return;
      }

      switch (this.router.url) {
        case '/network':
          this.showNoScript = true;
          break;
        case '/pricing':
          this.showNoScript = true;
          break;
        case '/billing':
          this.showNoScript = true;
          break;
        case '/login':
          this.showNoScript = true;
          break;
        case '/feedback':
          this.showNoScript = true;
          break;
        case '/activate':
          this.showNoScript = true;
          break;
        case '/reset':
          this.showNoScript = true;
          break;
        case '/recover':
          this.showNoScript = true;
          break;
        case '/confirm':
          this.showNoScript = true;
          break;
        case '/confirmation':
          this.showNoScript = true;
          break;
        case '/confirmChange':
          this.showNoScript = true;
          break;
        case '/whats-my-ip-address':
          this.showNoScript = true;
          break;
        default:
          this.showNoScript = false;
      }
    });
  }
}
