import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  currentTab: string = '';
  cpSwitch: boolean = true;
  mfSwitch: boolean = true;
  pnSwitch: boolean = true;
  psSwitch: boolean = true;
  mepSwitch: boolean = true;
  svSwitch: boolean = true;
  esSwitch: boolean = true;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) {
    this.document.title = 'Cypherpunk Privacy Features';
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.currentTab = tree.fragment; }
    });
  }
}
