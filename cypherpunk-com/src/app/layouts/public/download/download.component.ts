import * as platform from 'platform';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({ template: '' })
export class DownloadComponent {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // replace history
    let isBrowser = isPlatformBrowser(this.platformId);
    if (isBrowser) { history.replaceState({}, document.title, document.location.origin); }

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
    if (url.endsWith('autostart') && isBrowser) { path = path + '/autostart'; }
    router.navigate([path]);
  }
}
