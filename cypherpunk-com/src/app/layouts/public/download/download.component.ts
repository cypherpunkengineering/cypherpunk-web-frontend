import * as platform from 'platform';
import { Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { Location, isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({ template: '' })
export class DownloadComponent {

  constructor(
    private router: Router,
    private seo: SeoService,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Download Cypherpunk Privacy VPN Apps',
      description: 'Download links for all of Cypherpunk Privacy & VPN Apps for Windows, Macintosh, iOS, Android, Linux, Firefox, Chrome and More.',
      url: '/download'
    });

    // detect os setup
    let os: string = platform.os.family, path = '/apps';
    os = os || '';
    if (os.indexOf('OS X') > -1) { path = '/apps/macos'; }
    else if (os.indexOf('Window') > -1) { path = '/apps/windows'; }
    else if (os.indexOf('Android') > -1) { path = '/apps/android'; }
    else if (os.indexOf('iOS') > -1) { path = '/apps/ios'; }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint') > -1) {
      if (platform.os.architecture === 64) { path = '/apps/linux'; }
    }

    let url = router.routerState.snapshot.url;
    let isBrowser = isPlatformBrowser(this.platformId);
    if (url.endsWith('autostart') && isBrowser) { path = path + '/autostart'; }
    router.navigate([path]);
    // replace history
    if (isBrowser) { location.replaceState(path); }
  }
}
