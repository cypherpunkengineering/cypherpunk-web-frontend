import { Component } from '@angular/core';
import * as platform from 'platform';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  builds = {
    mac: {
      name: 'Mac',
      versions: '',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-macos-0.3.0-alpha-00350.pkg'
    },
    windows: {
      name: 'Windows',
      versions: '',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-windows-0.3.0-alpha-00330.exe'
    },
    linux: {
      name: 'Linux',
      versions: '',
      link: '#'
    },
    chrome: {
      name: 'Chrome',
      link: 'https://chrome.google.com/webstore/detail/cypherpunk-privacy/hecalkgndmedooonidcodmcamedkpgaj'
    },
    firefox: {
      name: 'Firefox',
      link: ''
    },
    opera: {
      name: 'Opera',
      link: 'https://chrome.google.com/webstore/detail/cypherpunk-privacy/hecalkgndmedooonidcodmcamedkpgaj'
    },
    android: {
      name: 'Android',
      versions: '4.0.3+',
      link: 'https://play.google.com/store/apps/details?id=com.cypherpunk.privacy'
    },
    ios: {
      name: 'iOS',
      versions: 'iOS 8+',
      link: 'https://itunes.apple.com/us/app/cypherpunk-privacy/id1174413930'
    },
    blank: {
      name: '',
      versions: '',
      link: '#'
    }
  };

  linuxVersions = [
    /*
    {
      os: 'Fedora/Redhat/CentOS',
      version: '32-bit',
      link: '#f32'
    },
    {
      os: 'Fedora/Redhat/CentOS',
      version: '64-bit',
      link: '#f64'
    },
    {
      os: 'Debian/Ubuntu/Mint',
      version: '32-bit',
      link: '#d32'
    },
    */
    {
      os: 'Debian/Ubuntu/Mint',
      version: '64-bit',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-linux-x64_0.3.0-alpha+00034.deb'
    }
  ];

  headerBuild = this.builds.blank;
  currentLinuxVersion: string = this.linuxVersions[0].link;

  // download
  thanks: string = '';
  countdown: number = 3;
  downloadBuildName: string = '';
  downloadBuildLink: string = '';
  showDownloadModal: boolean = false;
  isChrome: boolean = false;
  isSafari: boolean = false;

  constructor() {
    // detect os setup
    let os: string = platform.os.family;
    if (os.indexOf('OS X') > -1) { this.headerBuild = this.builds.mac; }
    else if (os.indexOf('Window') > -1) { this.headerBuild = this.builds.windows; }
    else if (os.indexOf('Android') > -1) { this.headerBuild = this.builds.android; }
    else if (os.indexOf('iOS') > -1) { this.headerBuild = this.builds.ios; }
    else { this.headerBuild = this.builds.blank; }

    // download file setup
    if (isBrowser) {
      this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    }
  }

  launchDownloadModal(build: any): void {
    this.thanks = '';
    this.countdown = 3;
    this.downloadBuildName = build.name;
    this.showDownloadModal = true;

    // figure out correct link
    let link = build.link;
    if (build.name === 'Linux') { link = this.currentLinuxVersion; }
    this.downloadBuildLink = link;

    // countdown timer
    let intervalId = setInterval(() => {
      this.countdown = this.countdown - 1;
      if (this.countdown === 0) {
        clearInterval(intervalId);
        this.thanks = 'Thank you for downloading Cypherpunk Privacy.';
      }
    }, 1000);

    // download file
    setTimeout(() => {
      this.downloadFile(link);
    }, 3100);
  }

  downloadFile (sUrl: string): boolean {
    // If in Chrome or Safari - download via virtual link click
    if (this.isChrome || this.isSafari) {
      // Creating new link node.
      let link = document.createElement('a');
      link.href = sUrl;

      if (link.download !== undefined) {
        // Set HTML5 download attribute. This will prevent file from opening if supported.
        let fileName = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
        link.download = fileName;
      }

      // Dispatching click event.
      if (document.createEvent) {
        let e = document.createEvent('MouseEvents');
        e.initEvent('click', true, true);
        link.dispatchEvent(e);
        return true;
      }
    }

    // Force file download (whether supported by server).
    if (sUrl.indexOf('?') === -1) { sUrl += '?download'; }

    window.open(sUrl, '_self');
    return true;
  };

}
