import { Router } from '@angular/router';
import { PlatformBuilds } from '../platform-builds';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './ios.component.html',
  styleUrls: ['./ios.component.css']
})
export class IosComponent {
  downloadLink: string;

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Cypherpunk iOS VPN & Online Privacy App',
      description: 'Protect your iOS device with the Cypherpunk iOS VPN & Online Privacy App.',
      url: '/apps/ios'
    });

    // determine platform param
    this.downloadLink = PlatformBuilds['ios'].link;
    let isBrowser = isPlatformBrowser(this.platformId);
    let url = router.routerState.snapshot.url;
    if (url.endsWith('autostart') && isBrowser) {
      window.location.href = this.downloadLink;
    }
  }
}
