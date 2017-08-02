import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './windows.component.html',
  styleUrls: ['./windows.component.css']
})
export class WindowsComponent {
  downloadLink: string;
  showDownloading: boolean;

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Windows VPN & Online Privacy App',
      description: 'Protect your Windows device with the Cypherpunk Windows VPN & Online Privacy App.',
      url: '/apps/windows'
    })

    // determine platform param
    this.downloadLink = PlatformBuilds['windows'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      this.showDownloading = true;
      PlatformBuilds.downloadFile(this.downloadLink, isBrowser);
    }
    if (url.endsWith('download') && isBrowser) { this.showDownloading = true; }
  }

    startDownload() { this.showDownloading = true; }
}
