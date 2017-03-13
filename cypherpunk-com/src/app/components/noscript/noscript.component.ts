import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-noscript',
  templateUrl: './noscript.component.html',
  styleUrls: ['./noscript.component.css']
})
export class NoScriptComponent implements OnInit {
  showNoScript: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      if (this.router.url.startsWith('/account')) {
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
        case '/feedback':
          this.showNoScript = true;
          break;
        case '/whatsmyip':
          this.showNoScript = true;
          break;
        default:
          this.showNoScript = false;
      }
    });
  }
}
