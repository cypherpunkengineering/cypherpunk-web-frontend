import * as platform from 'platform';
import { isPlatformBrowser } from '@angular/common';
import { PlatformBuilds } from '../platform-builds';
import { Router, ActivatedRoute } from '@angular/router';
import { SeoService } from '../../../../services/seo.service';
import { Component, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css']
})
export class AppsComponent {
  platform: string;
  downloadLink = '';
  showDownloading = false;
  windowsDownloadLink: string;
  macosDownloadLink: string;
  linuxDownloadLink: string;
  androidDownloadLink: string;
  iosDownloadLink: string;
  chromeDownloadLink: string;
  firefoxDownloadLink: string;
  windowsRedirectLink: string;
  macosRedirectLink: string;
  linuxRedirectLink: string;

  constructor(
    private router: Router,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    seo.updateMeta({
      title: 'Cypherpunk Privacy Apps & VPN Service',
      description: 'Download apps to protect your online privacy and freedom for every device. Try it free for a limited time only! 24/7/365 customer support.',
      url: '/app'
    });

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

    this.windowsDownloadLink = PlatformBuilds.windows.link;
    this.macosDownloadLink = PlatformBuilds.macos.link;
    this.linuxDownloadLink = PlatformBuilds.linuxVersions[0].link;
    this.androidDownloadLink = PlatformBuilds['android'].link;
    this.iosDownloadLink = PlatformBuilds['ios'].link;
    this.chromeDownloadLink = PlatformBuilds['chrome'].link;
    this.firefoxDownloadLink = PlatformBuilds['firefox'].link;
    this.windowsRedirectLink = '/apps/windows/download';
    this.macosRedirectLink = '/apps/macos/download';
    this.linuxRedirectLink = '/apps/linux/download';
  }

  pageRedirect(url) {
    this.router.navigate([url]);
  }

  startDownload() { this.showDownloading = true; }
}
