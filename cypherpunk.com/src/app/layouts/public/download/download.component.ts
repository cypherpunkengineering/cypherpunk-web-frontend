import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';
import { Router, ActivatedRoute } from '@angular/router';

export class DownloadPlatforms {
  static test = 'asdf';
  static mac = {
    name: 'Mac',
    versions: '',
    link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-macos-0.5.0-beta-00418.pkg'
  };

  static windows = {
    name: 'Windows',
    versions: '',
    link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-windows-0.5.0-beta-00383.exe'
  };

  static linux = {
    name: 'Linux',
    versions: '',
    link: '#'
  };

  static chrome = {
    name: 'Chrome/Opera/Vivaldi',
    versions: '',
    link: 'https://chrome.google.com/webstore/detail/cypherpunk-privacy/hecalkgndmedooonidcodmcamedkpgaj'
  };

  static firefox = {
    name: 'Firefox',
    versions: '',
    link: ''
  };

  static android = {
    name: 'Android',
    versions: '4.0.3+',
    link: 'https://play.google.com/store/apps/details?id=com.cypherpunk.privacy'
  };

  static ios = {
    name: 'iOS',
    versions: 'iOS 8+',
    link: 'https://itunes.apple.com/us/app/cypherpunk-privacy/id1174413930'
  };

  static blank = {
    name: '',
    versions: '',
    link: '#'
  };

  static linuxVersions = [
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
      name: 'Debian/Ubuntu/Mint',
      os: 'Debian/Ubuntu/Mint',
      version: '64-bit',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-linux-x64_0.5.0-beta+00094.deb'
    }
  ];
}

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {
  builds = DownloadPlatforms;
  headerBuild = DownloadPlatforms.blank;
  currentLinuxBuild = DownloadPlatforms.linuxVersions[0];

  // download
  isChrome: boolean = false;
  isSafari: boolean = false;
  downloadBuildName: string = '';
  downloadBuildLink: string = '';
  showDownloadSection: boolean = true;

  constructor(private router: Router, private route: ActivatedRoute) {
    let currentPlatform = route.snapshot.params['platform'];
    this.headerBuild = DownloadPlatforms[currentPlatform];
    if (!this.headerBuild) { this.headerBuild = DownloadPlatforms.blank; }

    if (currentPlatform === 'routers') {
      this.showDownloadSection = false;
      return;
    }

    // download file setup
    if (isBrowser) {
      this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    }

    // figure out correct link
    this.downloadBuildName = this.headerBuild.name;
    let link = this.headerBuild.link;
    if (this.headerBuild.name === 'Linux') {
      this.downloadBuildName = this.currentLinuxBuild.os + ' ' + this.currentLinuxBuild.version;
      link = this.currentLinuxBuild.link;
      this.downloadBuildLink = link;
    }
    else if (this.headerBuild.name === 'Chrome/Opera/Vivaldi' && isBrowser) {
      window.location.href = link;
      return;
    }
    else if (this.headerBuild.name === 'Android' && isBrowser) {
      window.location.href = link;
      return;
    }
    else if (this.headerBuild.name === 'iOS' && isBrowser) {
      window.location.href = link;
      return;
    }
    else { this.downloadBuildLink = link; }

    // download file
    this.downloadFile(link);
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
