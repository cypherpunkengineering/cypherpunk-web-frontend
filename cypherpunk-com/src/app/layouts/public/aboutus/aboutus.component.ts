import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Component, Inject } from '@angular/core';

@Component({
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  page: string;
  pages = ['manifesto', 'punks', 'facts', 'inquiries', 'assets', 'canary'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any
  ) {
    this.page = 'manifesto';
    this.document.title = 'About Cypherpunk Privacy';

    let page = this.activatedRoute.snapshot.params['page'];
    if (page === 'who-we-are') { this.page = page; }
    else if (page === 'manifesto') { this.page = page; }
    else if (page === 'punks') { this.page = page; }
    else if (page === 'facts') { this.page = page; }
    else if (page === 'inquiries') { this.page = page; }
    else if (page === 'assets') { this.page = page; }
    else if (page === 'canary') { this.page = page; }
    else { this.page = 'manifesto'; }
  }
}
