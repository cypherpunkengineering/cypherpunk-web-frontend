import * as platform from 'platform';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { isBrowser } from 'angular2-universal';

@Component({
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent {
  builds = {
    mac: {
      name: 'Mac',
      versions: '',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-macos-0.5.0-beta-00418.pkg'
    },
    windows: {
      name: 'Windows',
      versions: '',
      link: 'https://download.cypherpunk.com/release/cypherpunk-privacy-windows-0.5.0-beta-00383.exe'
    },
    linux: {
      name: 'Linux',
      versions: '',
      link: '#'
    },
    chrome: {
      name: 'Chrome/Opera/Vivaldi',
      link: 'https://chrome.google.com/webstore/detail/cypherpunk-privacy/hecalkgndmedooonidcodmcamedkpgaj'
    },
    firefox: {
      name: 'Firefox',
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

  headerBuild = this.builds.blank;
  currentLinuxBuild = this.linuxVersions[0];

  // download
  isChrome: boolean = false;
  isSafari: boolean = false;
  downloadBuildName: string = '';
  downloadBuildLink: string = '';
  showDownloadModal: boolean = false;

  constructor(private router: Router) {
    // detect os setup
    let os: string = platform.os.family;
    console.log(os);
    if (os.indexOf('OS X') > -1) { this.headerBuild = this.builds.mac; }
    else if (os.indexOf('Window') > -1) { this.headerBuild = this.builds.windows; }
    else if (os.indexOf('Android') > -1) { window.location.href = this.builds.android.link; }
    else if (os.indexOf('iOS') > -1) { window.location.href = this.builds.ios.link; }
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

      console.log('in linux');
      if (platform.os.architecture === 64) {
        this.headerBuild = this.builds.linux;
        this.currentLinuxBuild = this.linuxVersions[0];
      }
      else { this.headerBuild = this.builds.windows; }
      // else { this.currentLinuxBuild = this.linuxVersions[0]; }
    }
    else { this.headerBuild = this.builds.windows; }

    // download file setup
    if (isBrowser) {
      this.isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      this.isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    }
  }

  launchDownloadModal(build: any, event): boolean {
    event.preventDefault();
    event.stopPropagation();

    this.downloadBuildName = build.name;

    // figure out correct link
    let link = build.link;
    if (build.name === 'Linux') {
      this.downloadBuildName = this.currentLinuxBuild.os + ' ' + this.currentLinuxBuild.version;
      link = this.currentLinuxBuild.link;
      this.downloadBuildLink = link;
    }
    else if (build.name === 'Chrome/Opera/Vivaldi') { return window.location.href = link; }
    else if (build.name === 'Android') { return window.location.href = link; }
    else if (build.name === 'iOS') { return window.location.href = link; }
    else { this.downloadBuildLink = link; }

    // download file
    this.downloadFile(link);

    // show modal
    this.showDownloadModal = true;

    return false;
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
