import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './mac.component.html',
  styleUrls: ['./mac.component.css']
})
export class MacComponent {
  downloadLink: string;
  showDownloading: boolean;

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // determine platform param
    this.downloadLink = PlatformBuilds['macos'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      this.showDownloading = true;
      PlatformBuilds.downloadFile(this.downloadLink, isBrowser);
    }
    if (url.endsWith('download') && isBrowser) { this.showDownloading = true; }

    // handle meta tags and title
    let seoUrl = '/apps/';
    if (url.toLowerCase().indexOf('macos') > -1) { seoUrl = seoUrl + 'macos'; }
    else { seoUrl = seoUrl + 'mac'; }
    seo.updateMeta({
      title: 'Cypherpunk Mac VPN & Online Privacy App',
      description: 'Protect your Mac device with the Cypherpunk Macintosh VPN & Online Privacy App.',
      url: seoUrl
    });
  }

  startDownload() { this.showDownloading = true; }
}
