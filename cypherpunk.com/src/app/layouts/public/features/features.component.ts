import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, AfterViewInit, OnInit, Inject } from '@angular/core';

@Component({
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements AfterViewInit, OnInit {
  title: string = 'How Cypherpunk Privacy Protects Your Online Privacy and Freedom';
  description: string = 'Learn how Cypherpunk Privacy provides unrestricted access to the internet and protects your privacy online.';

  currentTab: string = 'freedom';
  cpSwitch: boolean = false;
  mfSwitch: boolean = false;
  pnSwitch: boolean = false;
  psSwitch: boolean = false;
  mepSwitch: boolean = false;
  svSwitch: boolean = false;
  esSwitch: boolean = false;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngAfterViewInit(): void { this.document.title = this.title; }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.currentTab = tree.fragment; }
    });
  }
}
