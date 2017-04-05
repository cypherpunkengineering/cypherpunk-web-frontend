import * as platform from 'platform';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { DownloadPlatforms } from './download.component';

@Component({ template: '' })
export class DownloadBaseComponent {
  constructor(private router: Router) {
    // replace history
    if (isBrowser) { history.replaceState({}, document.title, document.location.origin); }
    // detect os setup
    let os: string = platform.os.family;
    if (os.indexOf('OS X') > -1) { router.navigate(['/download/mac']); }
    else if (os.indexOf('Window') > -1) { router.navigate(['/download/windows']); }
    else if (os.indexOf('Android') > -1) { router.navigate([DownloadPlatforms['android'].link]); }
    else if (os.indexOf('iOS') > -1) { router.navigate([DownloadPlatforms['ios'].link]); }
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