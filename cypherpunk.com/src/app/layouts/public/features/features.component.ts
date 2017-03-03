import { Router, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements OnInit {
  currentTab: string = 'freedom';
  cpSwitch: boolean = true;
  mfSwitch: boolean = true;
  pnSwitch: boolean = true;
  psSwitch: boolean = true;
  mepSwitch: boolean = true;
  svSwitch: boolean = true;
  esSwitch: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) { return; }

      const tree = this.router.parseUrl(this.router.url);
      if (tree.fragment) { this.currentTab = tree.fragment; }
    });
  }
}
