import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './android.component.html',
  styleUrls: ['./android.component.css']
})
export class AndroidComponent {
  downloadLink: string;
  
  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.document.title = 'Cypherpunk Android VPN & Online Privacy App';

    // determine platform param
    this.downloadLink = PlatformBuilds['android'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      window.location.href = this.downloadLink;
    }
  }
}
