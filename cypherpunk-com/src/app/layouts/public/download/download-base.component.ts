import * as platform from 'platform';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { DownloadPlatforms } from './download.component';

@Component({ template: '' })
export class DownloadBaseComponent {
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
    if (os.indexOf('OS X') > -1) { router.navigate(['/download/mac']); }
    else if (os.indexOf('Window') > -1) { router.navigate(['/download/windows']); }
    else if (os.indexOf('Android') > -1) {
      window.location.href = DownloadPlatforms['android'].link;
    }
    else if (os.indexOf('iOS') > -1) {
      window.location.href = DownloadPlatforms['ios'].link;
    }
    // else if (os.indexOf('Fedora') > -1 ||
    //          os.indexOf('Red Hat') > -1 ||
    //          os.indexOf('CentOS')) {
    //   this.headerBuild = this.builds.linux;
    //   if (platform.os.architecture === 32) { this.currentLinuxBuild = this.linuxVersions[0]; }
    //   else { this.currentLinuxBuild = this.linuxVersions[0]; }
    // }
    else if (os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint') > -1) {

      if (platform.os.architecture === 64) {
        router.navigate(['/download/linux']);
        // this.currentLinuxBuild = this.linuxVersions[0];
      }
      else { router.navigate(['/download/windows']); }
      // else { this.currentLinuxBuild = this.linuxVersions[0]; }
    }
    else { router.navigate(['/download/windows']); }
  }
}
