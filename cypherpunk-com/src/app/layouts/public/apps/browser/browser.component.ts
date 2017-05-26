import { Component, Inject } from '@angular/core';
import { PlatformBuilds } from '../platform-builds';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent {
  chromeDownloadLink: string;
  firefoxDownloadLink: string;

  constructor(@Inject(DOCUMENT) private document: any) {
    this.document.title = 'Cypherpunk VPN & Online Privacy Browser Extensions for Chrome, Firefox, Opera & Vivaldi';

    this.chromeDownloadLink = PlatformBuilds['chrome'].link;
    this.firefoxDownloadLink = PlatformBuilds['firefox'].link;
  }
}
