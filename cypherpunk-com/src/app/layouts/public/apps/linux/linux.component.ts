import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './linux.component.html',
  styleUrls: ['./linux.component.css']
})
export class LinuxComponent {
  downloadLink: string;
  showDownloading: boolean;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.document.title = 'Cypherpunk Linux VPN & Online Privacy App';

    // determine platform param
    this.downloadLink = PlatformBuilds.linuxVersions[0].link;
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
