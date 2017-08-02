import { Component, Inject } from '@angular/core';
import { PlatformBuilds } from '../platform-builds';
import { SeoService } from '../../../../services/seo.service';

@Component({
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.css']
})
export class BrowserComponent {
  chromeDownloadLink: string;
  firefoxDownloadLink: string;

  constructor(private seo: SeoService) {
    seo.updateMeta({
      title: 'Cypherpunk VPN & Online Privacy Browser Extensions for Chrome, Firefox, Opera & Vivaldi',
      description: 'Protect your from internet browser with Cypherpunk VPN & Online Privacy Browser Extensions',
      url: '/apps/browser'
    });

    this.chromeDownloadLink = PlatformBuilds['chrome'].link;
    this.firefoxDownloadLink = PlatformBuilds['firefox'].link;
  }
}
