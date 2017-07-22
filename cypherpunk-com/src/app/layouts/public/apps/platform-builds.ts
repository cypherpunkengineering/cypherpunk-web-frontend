export class PlatformBuilds {
  static mac = {
    name: 'MacOS',
    appLink: '/apps/macos',
    versions: '',
    link: 'https://download.cypherpunk.com/release/macos/cypherpunk-privacy-macos-0.9.0-preview-01522.zip'
  };

  static macos = {
    name: 'MacOS',
    appLink: '/apps/macos',
    versions: '',
    link: 'https://download.cypherpunk.com/release/macos/cypherpunk-privacy-macos-0.9.0-preview-01522.zip'
  };

  static windows = {
    name: 'Windows',
    appLink: '/apps/windows',
    versions: '7 64-bit and later',
    link: 'https://download.cypherpunk.com/release/windows/cypherpunk-privacy-windows-0.9.0-preview-01522.exe'
  };

  static linux = {
    name: 'Linux',
    appLink: '/apps/linux',
    versions: '',
    link: '#'
  };

  static chrome = {
    name: 'Chrome/Opera/Vivaldi',
    appLink: '/apps/browser',
    versions: '',
    link: 'https://chrome.google.com/webstore/detail/cypherpunk-privacy/hecalkgndmedooonidcodmcamedkpgaj'
  };

  static firefox = {
    name: 'Firefox',
    appLink: '/apps/browser',
    versions: '',
    link: '#'
  };

  static android = {
    name: 'Android',
    appLink: '/apps/android',
    versions: '4.0.3+',
    link: 'https://play.google.com/store/apps/details?id=com.cypherpunk.privacy'
  };

  static ios = {
    name: 'iOS',
    appLink: '/apps/ios',
    versions: 'iOS 8+',
    link: 'https://itunes.apple.com/us/app/cypherpunk-privacy/id1174413930'
  };

  static blank = {
    name: '',
    versions: '',
    appLink: '',
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
      link: 'https://download.cypherpunk.com/release/debian/cypherpunk-privacy-linux-0.9.0-preview-01522.deb'
    }
  ];

  static downloadFile(sUrl: string, isBrowser) {
    // download file setup
    let isChrome, isSafari;
    if (isBrowser) {
      isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
      isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1;
    }

    // If in Chrome or Safari - download via virtual link click
    if (isChrome || isSafari) {
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

    if (isBrowser) { window.open(sUrl, '_self'); }
    return true;
  }
}
