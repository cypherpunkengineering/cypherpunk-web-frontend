import { Component } from '@angular/core';
import * as platform from 'platform';

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent {
  builds = {
    mac: {
      name: 'Mac',
      versions: '',
      link: ''
    },
    windows: {
      name: 'Windows',
      versions: '',
      link: ''
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
      name: 'FireFox',
      link: ''
    },
    opera: {
      name: 'Opera',
      link: ''
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
    {
      os: 'Debian/Ubuntu/Mint',
      version: '64-bit',
      link: '#d64'
    }
  ];

  headerBuild = this.builds.blank;
  currentLinuxVersion: string = this.linuxVersions[0].link;

  constructor() {
    let os: string = platform.os.family;

    if (os.indexOf('OS X') > -1) {
      this.headerBuild = this.builds.mac;
    }
    else if (os.indexOf('Window') > -1) {
      this.headerBuild = this.builds.windows;
    }
    else if (os.indexOf('Android') > -1) {
      this.headerBuild = this.builds.android;
    }
    else if (os.indexOf('iOS') > -1) {
      this.headerBuild = this.builds.ios;
    }
    else { this.headerBuild = this.builds.linux; }
  }

}
