import * as platform from 'platform';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({ template: '' })
export class AppsComponent {

  constructor(private router: Router, private location: Location) {
    // detect os setup
    let os: string = platform.os.family;
    if (os.indexOf('OS X') > -1) {
      router.navigate(['/apps/mac']);
      location.replaceState('/apps/mac');
    }
    else if (os.indexOf('Window') > -1) {
      router.navigate(['/apps/windows']);
      location.replaceState('/apps/windows');
    }
    else if (os.indexOf('Fedora') > -1 ||
             os.indexOf('Red Hat') > -1 ||
             os.indexOf('CentOS') > -1 ||
             os.indexOf('Debian') > -1 ||
             os.indexOf ('Ubuntu') > -1 ||
             os.indexOf ('Kubuntu') > -1 ||
             os.indexOf ('Xubuntu') > -1 ||
             os.indexOf('Mint')) {
      router.navigate(['/apps/linux']);
      location.replaceState('/apps/linux');
    }
    else {
      router.navigate(['/apps/windows']);
      location.replaceState('/apps/windows');
    }
  }
}
