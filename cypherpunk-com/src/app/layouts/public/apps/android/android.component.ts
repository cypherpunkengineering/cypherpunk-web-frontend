import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './android.component.html',
  styleUrls: ['./android.component.css']
})
export class AndroidComponent {
  downloadLink: string;

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Android VPN & Online Privacy App',
      description: 'Protect your Android device with the Cypherpunk Android VPN & Online Privacy App.',
      url: '/apps/android'
    })

    // determine platform param
    this.downloadLink = PlatformBuilds['android'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      window.location.href = this.downloadLink;
    }
  }
}
