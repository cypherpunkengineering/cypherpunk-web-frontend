import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './ios.component.html',
  styleUrls: ['./ios.component.css']
})
export class IosComponent {
  downloadLink: string;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.document.title = 'Cypherpunk iOS VPN & Online Privacy App';

    // determine platform param
    this.downloadLink = PlatformBuilds['ios'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      window.location.href = this.downloadLink;
    }
  }
}
