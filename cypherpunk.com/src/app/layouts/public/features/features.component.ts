import { Component, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent implements AfterViewInit {
  title: string = 'How Cypherpunk Privacy Protects Your Online Privacy and Freedom';
  description: string = 'Learn how Cypherpunk Privacy provides unrestricted access to the internet and protects your privacy online.';

  currentTab: string = 'online-privacy';

  pnSwitch: boolean = false;
  psSwitch: boolean = false;
  esSwitch: boolean = false;
  eppSwitch: boolean = false;
  snSwitch: boolean = false;
  mepSwitch: boolean = false;
  svSwitch: boolean = false;

  cpSwitch: boolean = false;
  mfSwitch: boolean = false;
  faSwitch: boolean = false;
  fwSwitch: boolean = false;
  fnSwitch: boolean = false;

  constructor(
    @Inject(DOCUMENT) private document: any,
    private location: Location
  ) { }

  ngAfterViewInit(): void { this.document.title = this.title; }

  updateLocation(fragment: string) {
    this.currentTab = fragment;
    let element = document.querySelector('#' + fragment);
    if (element) {
      this.location.go('/features#' + fragment);
      element.scrollIntoView({behavior: 'smooth'});
    }
  }
}
