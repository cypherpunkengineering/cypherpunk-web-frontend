import * as platform from 'platform';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { PlatformBuilds } from '../platform-builds';

@Component({
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent {
  apkUrl = '#';
  platform: string;
  downloadLink = '';
  showDownloading = false;
  androidDownloadLink: string;
  iosDownloadLink: string;
  chromeDownloadLink: string;
  firefoxDownloadLink: string;

  constructor(
    @Inject(DOCUMENT) private document: any,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // handle title
    this.document.title = 'Cypherpunk Privacy Suite';

    // detect os setup
    let os: string = platform.os.family || '';
    if (os.indexOf('OS X') > -1) { this.platform = 'MacOS'; }
    else if (os.indexOf('Window') > -1) { this.platform = 'Windows';  }
    else if (os.indexOf('Android') > -1) { this.platform = 'Android'; }
    else if (os.indexOf('iOS') > -1) { this.platform = 'iOS'; }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint') > -1) {
      this.platform = 'Linux';
    }

    // determine platform build link
    if (this.platform) {
      let build = PlatformBuilds[this.platform.toLowerCase()];
      if (build.name === 'Linux') { this.downloadLink = PlatformBuilds.linuxVersions[0].link; }
      else { this.downloadLink = build.link; }
    }

    this.androidDownloadLink = PlatformBuilds['android'].link;
    this.iosDownloadLink = PlatformBuilds['ios'].link;
    this.chromeDownloadLink = PlatformBuilds['chrome'].link;
    this.firefoxDownloadLink = PlatformBuilds['firefox'].link;
  }

  startDownload() { this.showDownloading = true; }
}
