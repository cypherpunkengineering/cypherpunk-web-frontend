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
    if (isPlatformBrowser(this.platformId)) {
      history.replaceState({}, document.title, document.location.origin);
    }

    // detect os setup
    let os: string = platform.os.family;
    os = os || '';
    if (os.indexOf('OS X') > -1) { router.navigate(['/apps/macos']); }
    else if (os.indexOf('Window') > -1) { router.navigate(['/apps/windows']); }
    else if (os.indexOf('Android') > -1) { router.navigate(['/apps/android']); }
    else if (os.indexOf('iOS') > -1) { router.navigate(['/apps/ios']); }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint') > -1) {
      if (platform.os.architecture === 64) { router.navigate(['/apps/linux']); }
      else { router.navigate(['/apps']); }
    }
    else { router.navigate(['/apps']); }
  }
}
