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
      versions: '10.8 - 10.11',
      link: ''
    },
    windows: {
      name: 'Windows',
      versions: 'XP, Vista, 7, 8, 10',
      link: ''
    },
    linux: {
      name: 'Linux',
      versions: 'xx - xx',
      link: ''
    },
    chrome: {
      name: 'Chrome',
      versions: 'xx - xx',
      link: ''
    },
    firefox: {
      name: 'FireFox',
      versions: 'xx - xx',
      link: ''
    },
    opera: {
      name: 'Opera',
      versions: 'xx - xx',
      link: ''
    },
    android: {
      name: 'Android',
      versions: '4.0.3+',
      link: ''
    },
    ios: {
      name: 'iOS',
      versions: 'iOS 8+',
      link: ''
    }
  };

  headerBuild = this.builds.mac;

  constructor() {
    let os: string = platform.os.family;

    if (os.indexOf('OS X') > -1) {
      this.headerBuild = this.builds.mac;
    }
    else if (os.indexOf('Window')) {
      this.headerBuild = this.builds.windows;
    }
    else if (os.indexOf('Android')) {
      this.headerBuild = this.builds.android;
    }
    else if (os.indexOf('iOS')) {
      this.headerBuild = this.builds.ios;
    }
    else { this.headerBuild = this.builds.linux; }
  }
}
