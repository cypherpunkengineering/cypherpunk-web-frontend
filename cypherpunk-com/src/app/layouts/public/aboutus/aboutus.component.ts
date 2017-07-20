import { DOCUMENT } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  page: string;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.page = 'manifesto';
    this.document.title = 'About Cypherpunk Privacy';
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.page = tree.fragment; }
    });
  }

}
